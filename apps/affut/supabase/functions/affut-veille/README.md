# Edge Function `affut-veille`

Point d'entrée unique de la routine cloud de veille (Lot 8) vers Supabase —
voir le détail de l'architecture en tête d'`index.ts` et l'entrée « Lot 8 »
dans `apps/affut/AVANCEMENT.md`.

## Déploiement

Sans CLI Supabase installée localement : dashboard Supabase du projet
`portail` → **Edge Functions** → **Deploy a new function** → nom
`affut-veille` → coller le contenu de `index.ts` → Deploy.

Avec la CLI (si disponible) :

```
supabase functions deploy affut-veille --no-verify-jwt --project-ref uoeuzxstotqnembcpofx
```

`--no-verify-jwt` : l'authentification ne passe pas par un compte Supabase
Auth mais par le jeton `AFFUT_VEILLE_TOKEN` (en-tête `x-veille-token`),
vérifié dans `index.ts`.

## Secret à poser

`SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont fournis automatiquement
par la plateforme à toute Edge Function — rien à faire. Seul
`AFFUT_VEILLE_TOKEN` doit être posé manuellement (Dashboard → Edge
Functions → `affut-veille` → Secrets, ou `supabase secrets set
AFFUT_VEILLE_TOKEN=... --project-ref uoeuzxstotqnembcpofx`).

C'est ce même jeton qui doit être posé côté routine Claude Code (variable
d'environnement `AFFUT_VEILLE_TOKEN` de l'environnement cloud utilisé par
la routine `affut-veille-hebdo`) — c'est le seul secret que la routine
détient désormais, à la place de la clé `service_role` complète.

## Appel depuis la routine

```
GET  https://uoeuzxstotqnembcpofx.supabase.co/functions/v1/affut-veille
     -H "x-veille-token: $AFFUT_VEILLE_TOKEN"
     → contexte (numéro cible, moisson actuelle, retenus/écartés récents, URLs déjà
       utilisées, sources suivies à moissonner en priorité — écran « Sources »,
       rubriques déjà en usage — les 4 de base + celles créées depuis en rédaction)

POST https://uoeuzxstotqnembcpofx.supabase.co/functions/v1/affut-veille
     -H "x-veille-token: $AFFUT_VEILLE_TOKEN"
     -H "content-type: application/json"
     -d '{"numero": 14, "candidats": [...]}'
     → écrit les candidats dans affut_numeros.moisson, journalise. Refuse tout
       candidat déjà vu (retenu, écarté ou en attente, quel que soit le numéro) —
       voir « Anti-doublons » ci-dessous.
```

## Anti-doublons (26/09/2026)

Le `POST` compare chaque candidat à **tout ce que la veille a déjà vu, depuis
toujours** : entrées retenues (tous numéros), candidats écartés, candidats en
attente dans une moisson. Trois clés, dans cet ordre : identifiant, adresse
normalisée (sans `http`/`https`, `www.`, `/` final, ancre, paramètres de
pistage `utm_*`, `fbclid`…), titre normalisé (sans accents, casse ni
ponctuation ; comparé seulement au-delà de 20 caractères). La réponse détaille
les refus :

```
{ "ok": true, "candidats_ajoutes": 12, "candidats_ignores_doublon": 5,
  "doublons": [ { "id": "…", "titre": "…", "raison": "deja_ecarte" }, … ],
  "candidats_ignores_faute_de_place": 0 }
```

`raison` ∈ `deja_retenu`, `deja_ecarte`, `deja_en_moisson`,
`doublon_dans_le_lot`. Le `GET` renvoie en plus `titres_deja_vus` (les 300 plus
récents) ; `urls_deja_utilisees` couvre désormais aussi les écartés et les
candidats en attente. Si la lecture de l'historique échoue, le `POST` répond
500 (il ne laisse pas passer de doublons en silence) : réessayer.

Test local de la logique de comparaison : `node apps/affut/supabase/tests/dedoublonnage.test.mjs`.

**À redéployer** après ce changement (voir « Déploiement » ci-dessus).

## Formats et motifs (26/09/2026, migration 017)

La veille apprend des **formats** d'actualité, jamais des sources.

- **`POST`** : chaque candidat porte un `format` (code parmi `formats_autorises`).
  Valeur inconnue → retirée, candidat gardé non classé, signalée dans
  `avertissements`.
- **`GET`** renvoie en plus `formats_autorises` (codes + définitions),
  `bilan_par_format` (retenues / écartées par format) et
  `motifs_ecart_frequents`. Ces deux derniers valent `null` tant que la
  migration `017-format-et-motif-ecart.sql` n'est pas appliquée (le reste du
  contexte fonctionne sans elle). **Aucun compteur par source** — voulu.
- L'enseignant choisit le motif d'un écart en un clic (`motif_code`), en plus
  du texte libre.

**Ordre de mise en service** : 1) appliquer `017-…sql` dans le SQL Editor,
2) redéployer cette fonction, 3) déployer le front (merge de la PR).
Tests : `node apps/affut/supabase/tests/dedoublonnage.test.mjs` et
`…/bilan-formats.test.mjs`.

## Règles éditoriales (26/09/2026, migration 018)

- **`GET`** renvoie `regles_editoriales` (règles actives, en entier — `null` tant
  que la migration n'est pas appliquée), `peut_proposer_des_regles` (premier
  samedi du mois ET aucune proposition en attente) et `propositions_refusees`.
- **`POST {"propositions": [{"texte", "justification"}]}`** (sans `candidats`) :
  3 propositions au plus, texte de 5 à 400 caractères, **aucune adresse ni
  source** (refusé), doublons de règles existantes/refusées ignorés, `409` s'il
  reste des propositions non tranchées. Atterrit dans
  `affut_propositions_regles` ; jamais dans `affut_regles_editoriales`, que seul
  le rédacteur connecté à l'app modifie.
- Tables protégées comme le reste de la rédaction (RLS, aucune vue publique).

**Ordre de mise en service** : 1) appliquer `018-regles-editoriales.sql`,
2) redéployer cette fonction, 3) merger le front. Tests :
`node apps/affut/supabase/tests/{dedoublonnage,bilan-formats,memoire}.test.mjs`.

## Plafonds à connaître côté appelant

Posés le 31/08/2026 (durcissement, en tête d'`index.ts`) — ils ne sont pas
négociables depuis l'appelant, autant les avoir en tête avant d'envoyer :

| Plafond | Valeur | Comportement au dépassement |
|---|---|---|
| Candidats par `POST` | **20** | **400, envoi rejeté en entier** — la fonction ne tronque pas |
| `POST` par heure glissante | 10 | 429 |
| Candidats dans la moisson d'un numéro | 100 | le surplus est ignoré silencieusement |
| `titre`, `source.*`, un élément de `chiffres` | 200 caractères | 400 |
| `resume`, `usage` | 2 000 caractères | 400 |
| Éléments de `chiffres` | 20 | 400 |

Le brief demande désormais 15 à 20 candidats par exécution, voire davantage
(voir « Volume attendu » dans `documents/brief-veille.md`) : au-delà de 20,
**découper en plusieurs `POST` de 20 maximum** sur le même numéro. Avec 10
appels par heure autorisés, cela laisse de la marge.

⚠️ Le `GET` renvoie au plus **200** sources suivies (`.limit(200)` sur
`affut_sources_suivies`, relevé de 50 le 12/09/2026 après la fusion avec
l'ancien catalogue de revues — voir plus bas). Tant que la table en compte
moins, aucun effet ; au-delà, les sources les plus récemment créées
disparaîtraient du contexte **sans aucun message d'erreur**. À relever si la
liste s'étoffe encore.

## Périodicité des sources suivies (12/09/2026)

`affut_sources_suivies` porte une colonne `periodicite` (`hebdomadaire` par
défaut, ou `mensuelle`) — voir migration
`supabase/013-sources-suivies-periodicite.sql`. Le `GET` ne renvoie dans
`sources_a_moissonner` que :
- les sources `hebdomadaire`, à chaque exécution ;
- **un tiers, par rotation, des sources `mensuelle`** (révisé le 12/09/2026 —
  la première version renvoyait tout le bloc mensuel en une seule exécution
  par mois, jugé trop coûteux en temps/crédits pour ~137 sources d'un coup).
  Chaque source mensuelle est assignée à l'un de 3 groupes par un hash
  déterministe de son `id` (`groupeRotation()`, pas stocké en base — recalculé
  à chaque appel), et le groupe actif tourne avec le numéro de semaine ISO
  (`numeroSemaineIso() % 3`). Chaque source mensuelle est donc visitée une
  semaine sur trois, jamais toutes le même jour.

Avant cette date, il existait une seconde liste — un catalogue statique de
137 revues/bulletins dans `documents/brief-veille.md`, visité une fois par
mois par une logique côté agent plutôt que côté serveur. Elle a été
migrée dans cette même table (`periodicite = 'mensuelle'`) pour qu'il n'y
ait plus qu'une seule liste d'adresses à consulter, éditable depuis l'écran
« Sources » de l'app plutôt que dans un fichier markdown.
