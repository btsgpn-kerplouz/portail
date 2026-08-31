# Carnet de veille naturaliste — brief pour Claude Design, puis Claude Code

> **Mode d'emploi.** La partie **A** se colle telle quelle dans Claude Design : c'est le brief visuel et les écrans à dessiner. Les parties **B**, **C** et **D** se gardent pour Claude Code : modèle de données, règles métier, pile technique et chaîne d'alimentation.
>
> **Pile retenue : Cloudflare (hébergement du portail) + Supabase (données et authentification).**

---

## A — Brief à transmettre à Claude Design

### Le projet en une phrase

Concevoir le **Carnet de veille naturaliste**, l'espace de veille hebdomadaire d'un enseignant de BTS Gestion et Protection de la Nature, intégré au portail numérique de la formation. Une veille produite chaque semaine, filtrée par l'enseignant, puis publiée aux étudiants — et archivée numéro après numéro.

### Qui s'en sert, et pour quoi

**L'enseignant, en coulisses.** Chaque semaine il reçoit une moisson d'entrées candidates, déposées automatiquement en brouillon. Il les lit, coche celles qu'il retient, en ajoute à la main quand il a trouvé quelque chose de son côté, et écrit pour lui-même les pistes d'exploitation pédagogique. Cette écriture-là ne sort jamais du back-office.

**Les étudiants, sur le portail.** Ils lisent le numéro publié : une liste courte d'actualités naturalistes récentes, chacune avec son lien vers la source, et ils peuvent remonter dans les numéros précédents. C'est une revue de presse professionnelle, pas un flux d'actualités générique — c'est le geste de veille du technicien de la nature qu'on leur montre en train de se faire.

**Ce qui distingue ce projet.** La matière est naturaliste et locale : des conservatoires d'espaces naturels, des parcs nationaux, des associations départementales. Les entrées portent des chiffres de terrain (770 chauves-souris comptées un soir, 30 quelques jours plus tard ; 65 205 € pour un plan de gestion ; 21 individus vivants connus d'une espèce marine). Le design doit faire respirer ces chiffres, pas les noyer.

### Direction artistique

**Registre.** Carnet de terrain professionnel, pas magazine nature. Sobre, dense en information, lisible d'un coup d'œil. L'enseignant scanne dix entrées en trois minutes le samedi matin ; l'étudiant lit sur son téléphone dans le bus.

**À éviter explicitement** : le vert « écologie » saturé, les photos de paysages en pleine largeur, les icônes-feuilles, les gradients, les cartes arrondies avec liseré coloré. Le sujet est scientifique et administratif autant que naturaliste.

**Trois pistes possibles**, à explorer et à départager :
1. *Carnet de relevés* — papier légèrement teinté, grille visible, typographie de rapport scientifique, un seul accent.
2. *Fiche d'inventaire* — très structuré, rail latéral portant tag / date / source, chiffres alignés en tabulaire, aucune décoration.
3. *Revue de presse spécialisée* — hiérarchie éditoriale forte, chapô, filets fins, respiration entre les entrées.

**Contraintes fermes.**
- Thème clair **et** thème sombre, tous deux traités avec le même soin.
- Accessibilité **RGAA** : établissement de formation publique. Contrastes conformes, navigation clavier complète, états de focus visibles, structure de titres correcte.
- Mobile d'abord sur la vue publiée.
- Une **feuille d'impression** propre : l'enseignant imprime un numéro pour le distribuer en cours. Sur papier, pas de navigation, les URL des liens s'affichent en toutes lettres.
- L'ensemble doit pouvoir s'accorder à la charte du portail de la formation : prévoir les couleurs et les typographies comme des variables, pas en dur.

### Composants à dessiner

**La carte d'entrée** — c'est la brique centrale, à traiter en priorité. Elle porte :
- un rail d'identification : rubrique, date de publication de la source, nom de la source et son échelle territoriale (nationale / régionale / départementale — l'échelle est une information, elle doit se voir) ;
- un titre ;
- une liste facultative de **chiffres clés**, alignés, en chiffres tabulaires ;
- un résumé factuel court ;
- un ou plusieurs **liens vers la source primaire**, visiblement cliquables et vérifiés ;
- un encadré **« Usage en cours »** — visuellement distinct, marqué comme non publié ;
- une **case de validation** et un **badge d'état** (validée / en attente / écartée) ;
- une pastille discrète d'origine : collectée automatiquement ou saisie à la main.

Dessiner ses variantes : validée, non validée, entrée manuelle, entrée dont le lien est mort ou la source signalée inaccessible, entrée sans chiffres clés.

**Écrans attendus.**
1. **Sommaire des numéros** — l'archive. Chaque numéro : son numéro, sa semaine, son nombre d'entrées publiées, et deux ou trois titres en aperçu. Doit rester lisible à cinquante numéros, donc prévoir un regroupement par mois ou par année scolaire et une recherche.
2. **Un numéro, vue publiée** — ce que voient les étudiants : entrées validées seulement, sans les encadrés « Usage en cours », regroupées par rubrique.
3. **Un numéro, vue rédaction** — ce que voit l'enseignant : toutes les entrées, cases à cocher, encadrés d'usage visibles, compteur « x sur y validées », bouton d'ajout, bouton de publication.
4. **Formulaire d'ajout / d'édition d'une entrée** — court, tolérant, utilisable au téléphone. Vérification du lien à la saisie.
5. **Recherche transversale** — retrouver une entrée dans tous les numéros par mot-clé, rubrique, source, territoire ou année.
6. **États limites** — numéro vide, aucune entrée validée, lien mort, recherche sans résultat, brouillon hebdomadaire pas encore arrivé.

**Deux détails qui comptent.**
- Le passage entre vue rédaction et vue publiée doit être un basculement immédiat et évident : l'enseignant doit pouvoir vérifier en un geste ce que verront réellement ses étudiants.
- L'encadré « Usage en cours » doit porter sa nature privée dans sa forme même, pas seulement dans une étiquette — il ne doit jamais pouvoir être confondu avec du contenu publié.

### Contenu de travail

Ne pas utiliser de faux texte. Composer avec de vraies entrées, par exemple :

> **Ce que coûte un plan de gestion : 18 mois et 65 205 € pour deux réserves**
> Rubrique : Terrain & gestion — 11 août 2026 — Conservatoire des Sites Alsaciens (Bas-Rhin, régional)
> Chiffres clés : 2 réserves · 18 mois d'étude · plans couvrant 10 ans · 65 205 € dont 35 184 € de FEDER
> Résumé : Le Conservatoire publie le détail du renouvellement des plans de gestion des réserves naturelles nationales de l'île de Rhinau et de la forêt d'Erstein — dix-huit mois d'étude préalable, protocoles par taxon, cartographie d'habitats, validation en comité consultatif.
> Usage en cours *(non publié)* : les coûts réels d'un plan de gestion ne sont presque jamais publiés. Faire reconstituer l'enchaînement diagnostic → protocoles → cartographie → validation, puis faire répartir 65 205 € entre ces postes avant de comparer au réel.

> **770 rhinolophes un soir, 30 quelques jours plus tard**
> Rubrique : Science & protocoles — 10 août 2026 — Parc national des Cévennes (Gard, régional)
> Chiffres clés : années 1990 ≈ 30 individus · juillet 2022 : 550 · automne 2025 : ≈ 1 300 · juillet 2026 : 770 puis 30
> Résumé : Une cavité redécouverte en 2022 accueille des effectifs qui s'évanouissent fin juillet, avant la mise bas. Le site serait un gîte de transition, ce qui implique une nurserie commune non localisée à plusieurs dizaines de kilomètres.
> Usage en cours *(non publié)* : donner les deux chiffres sans le contexte, faire conclure, puis expliquer le gîte de transit. Entrée idéale sur les limites d'un comptage ponctuel.

Rubriques à représenter : **Terrain & gestion**, **Science & protocoles**, **Données & référentiels**, **Pépites**.

---

## B — Modèle de données et règles métier

### Tables Supabase

**`numeros`**

| colonne | type | notes |
|---|---|---|
| `id` | uuid | clé primaire |
| `slug` | text unique | `2026-w35` — sert d'URL publique, immuable |
| `numero` | int | 1, 2, 3… |
| `semaine_debut`, `semaine_fin` | date | |
| `date_collecte` | date | |
| `statut` | enum | `brouillon` \| `publie` |
| `publie_le` | timestamptz | nul tant que brouillon |

**`entrees`**

| colonne | type | notes |
|---|---|---|
| `id` | uuid | clé primaire, sert d'ancre `#` dans la page |
| `numero_id` | uuid | référence `numeros` |
| `titre` | text | |
| `date_source` | date | date de publication de la source, pas de la collecte |
| `source_nom` | text | ex. « Conservatoire des Sites Alsaciens » |
| `source_echelle` | enum | `nationale` \| `regionale` \| `departementale` \| `internationale` |
| `territoire` | text | région ou département, nullable |
| `rubrique` | enum | `terrain` \| `science` \| `donnees` \| `pepite` |
| `liens` | jsonb | `[{libelle, url, verifie_le, statut_http}]`, au moins un |
| `resume` | text | court, factuel |
| `chiffres` | text[] | nullable, rendu en liste alignée |
| `reserve` | text | nullable — mention d'une vérification incomplète, **affichée publiquement** |
| `usage_en_cours` | text | **privé, jamais exposé au public** |
| `valide` | boolean | défaut `false` |
| `origine` | enum | `auto` \| `manuelle` |
| `ordre` | int | position dans la rubrique |

**`ingestion_log`** — trace des dépôts automatiques : horodatage, nombre d'entrées reçues, résultat, charge utile brute conservée pour rejouer un import raté.

### Règles métier, non négociables

1. **`usage_en_cours` ne franchit jamais la frontière du public.** L'exclusion se fait dans la base, pas dans le rendu : privilège de colonne PostgreSQL (`GRANT SELECT (…) ON entrees TO anon` sans `usage_en_cours`) **et** vue publique dédiée. Aucun masquage CSS, aucun `hidden` côté client, aucun champ présent-mais-invisible dans le HTML servi.
2. Une entrée non validée n'apparaît pas dans la vue publiée. Un numéro en brouillon n'est pas accessible publiquement, même à son URL.
3. Un numéro publié reste accessible indéfiniment à son **URL stable et lisible** (`/veille/2026-w35`), y compris après publication du suivant. Aucune URL publiée ne change jamais.
4. La validation est **réversible** : décocher une entrée d'un numéro déjà publié la retire immédiatement de la vue publique.
5. Les liens sont **vérifiés à la saisie** et **revérifiés périodiquement** ; un lien mort est signalé dans la vue rédaction, jamais silencieusement supprimé. La règle de veille existante s'applique : une source inaccessible est signalée dans la page, pas relayée sans contrôle — d'où le champ `reserve`, qui est public par construction.
6. Un numéro publié doit pouvoir être **imprimé ou exporté en PDF**.

### Fonctions attendues

- Cocher / décocher une entrée, individuellement et en lot.
- Ajouter, éditer, supprimer une entrée manuellement, y compris dans un numéro déjà publié.
- Réordonner les entrées et changer leur rubrique.
- Basculer entre vue rédaction et vue publiée.
- Publier un numéro (`brouillon` → `publie`), et le dépublier.
- Rechercher dans tous les numéros : texte libre, rubrique, source, échelle territoriale, période.
- Flux RSS ou Atom du fil publié.

---

## C — Pile technique

### Cloudflare

- **Cloudflare Pages** sert le portail. La vue publiée est rendue statiquement ou en périphérie, et mise en cache ; le cache d'un numéro est purgé à sa publication et à chaque changement de validation.
- **Cloudflare Pages Functions / Workers** portent les points d'entrée serveur : l'endpoint d'ingestion (§ D), la revérification périodique des liens via **Cron Triggers**, et la purge de cache. Les secrets vivent dans les variables d'environnement Workers, jamais dans le dépôt ni dans le client.
- **Cloudflare Access** protège `/veille/admin` — c'est la solution la plus simple pour un auteur unique, et elle évite d'écrire une page de connexion.

### Supabase

- **Postgres** pour les deux tables et la vue publique.
- **RLS activé sur les deux tables**, sans exception. Politique publique : lecture des entrées `valide = true` appartenant à un numéro `statut = 'publie'`, sur une vue qui ne porte pas `usage_en_cours`. Politique auteur : tout, pour l'utilisateur authentifié.
- **Supabase Auth** si l'accès doit un jour s'ouvrir à plusieurs collègues ; sinon Cloudflare Access suffit et l'application n'utilise côté rédaction qu'une clé de service détenue par le Worker.
- La **clé `service_role` ne quitte jamais le serveur.** Le client public n'utilise que la clé anonyme, et la sécurité repose sur la RLS et le privilège de colonne — pas sur le fait que le front ne demande pas le champ privé.

**Point de vigilance à faire respecter par Claude Code :** avec Supabase, il est tentant d'appeler la base directement depuis le navigateur avec la clé anonyme. C'est acceptable pour la vue publiée si et seulement si la RLS et le privilège de colonne sont en place et testés. **Écrire un test qui interroge la vue publique avec la clé anonyme et échoue si `usage_en_cours` remonte, ou si une entrée non validée apparaît.** C'est le test le plus important du projet.

---

## D — Comment la veille hebdomadaire arrive jusqu'à la page

C'est le maillon qui manque aujourd'hui. Trois briques, dans cet ordre de mise en œuvre.

**1. Un endpoint de dépôt.** Un Cloudflare Worker exposé sur `POST /api/veille/ingest`, protégé par un jeton porteur unique stocké en secret Worker. Il reçoit un JSON conforme au modèle du § B, crée un `numero` au statut `brouillon`, insère les entrées avec `origine = 'auto'` et `valide = false`, écrit une ligne dans `ingestion_log`, et répond avec l'URL de la vue rédaction du numéro créé. Idempotent sur le `slug` : un second dépôt pour la même semaine met à jour le brouillon au lieu de créer un doublon.

**2. La tâche hebdomadaire appelle cet endpoint.** La veille automatique du samedi matin produit déjà les entrées vérifiées ; il lui suffit de les sérialiser au format attendu et de les poster. Elle n'a besoin de rien d'autre que l'URL et le jeton. Elle ne publie jamais : elle dépose un brouillon et notifie.

**3. Une porte de secours manuelle.** Dans la vue rédaction, un bouton **« Importer un JSON »** qui accepte le même format collé à la main. Cela permet de faire tourner le dispositif avant que l'endpoint existe, de rejouer un dépôt raté, et de ne jamais dépendre entièrement de l'automatisation.

**Ordre de construction conseillé.** Commencer par le § 3 — l'import manuel et la vue rédaction. Le dispositif devient utilisable immédiatement, avec un copier-coller par semaine. Ajouter l'endpoint ensuite, quand le format s'est stabilisé à l'usage.

**Format d'échange** (à figer dès le début, c'est le contrat entre la veille et le portail) :

```json
{
  "numero": 2,
  "slug": "2026-w36",
  "semaine_debut": "2026-08-30",
  "semaine_fin": "2026-09-05",
  "date_collecte": "2026-09-05",
  "entrees": [
    {
      "titre": "Ce que coûte un plan de gestion : 18 mois et 65 205 € pour deux réserves",
      "date_source": "2026-08-11",
      "source_nom": "Conservatoire des Sites Alsaciens",
      "source_echelle": "regionale",
      "territoire": "Bas-Rhin",
      "rubrique": "terrain",
      "liens": [
        { "libelle": "CSA — Renouvellement des plans de gestion", "url": "https://…" }
      ],
      "resume": "…",
      "chiffres": ["2 réserves", "18 mois d'étude", "65 205 € dont 35 184 € de FEDER"],
      "reserve": null,
      "usage_en_cours": "…"
    }
  ]
}
```

---

## E — Reste à trancher

**Qui publie ?** Toi seul, ou plusieurs collègues ? Avec un auteur unique, Cloudflare Access suffit et le projet est nettement plus léger. À plusieurs, il faut Supabase Auth, des rôles, et une trace de qui a validé quoi — c'est faisable dès le départ, mais autant le décider maintenant que le rétrofitter.

**Une précision sur la publication.** Le brouillon hebdomadaire arrive automatiquement, mais rien n'est visible des étudiants tant que tu n'as pas coché et publié. Si tu es absent une semaine, le numéro reste en brouillon — c'est le comportement voulu, et il vaut mieux qu'une publication automatique.
