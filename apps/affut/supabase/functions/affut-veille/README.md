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
     → écrit les candidats dans affut_numeros.moisson (dédoublonnés), journalise
```

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

⚠️ Le `GET` renvoie au plus **50** sources suivies (`.limit(50)` sur
`affut_sources_suivies`, sans tri par pertinence). Tant que l'écran Sources
en compte moins, aucun effet ; au-delà, les sources les plus récemment
créées disparaîtraient du contexte **sans aucun message d'erreur**. À relever
si la liste s'étoffe.
