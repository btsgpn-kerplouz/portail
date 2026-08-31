# Brief éditorial — veille automatique « À l'affût »

> Fichier de cadrage **versionné**, lu par l'agent planifié (Lot 8) à chaque
> exécution hebdomadaire. Modifier le filtre éditorial = éditer ce fichier,
> pas un réglage caché en base. Rédigé à partir du brief d'origine
> (`documents/promptveilleportail.md`, partie A) et des exemples de
> `documents/carnetveille.html`.

## Rôle de l'agent

Une fois par semaine, chercher sur le web des actualités naturalistes
récentes et publiables dans le carnet de veille "à l'affût" du BTS GPN (Kerplouz), les
mettre en forme selon le modèle ci-dessous, et les écrire **en base, en
attente de tri** — jamais publiées directement. Le tri (Retenir/Écarter)
reste un geste humain, fait par l'enseignant dans l'écran « Moisson » déjà
construit au Lot 4.

L'agent ne décide jamais seul de ce qui est bon : il propose une liste
resserrée de candidats plausibles. L'enseignant doit pouvoir trier en quelques minutes un
samedi matin.

## Public et angle

Étudiants de BTS Gestion et Protection de la Nature. Le carnet doit leur
montrer le geste de veille du technicien de la nature en train de se
faire — pas un flux d'actualités « écologie » grand public. Les entrées
portent des chiffres de terrain concrets (effectifs comptés, budgets,
durées d'étude, surfaces), mais ce n'est pas redhibitoire si la source d'information ne comporte pas de chiffres. 
Un autre objectif est de permettre de dresser un panel varier des métiers et missions de la protection de la nature, gestion des espaces naturels et de leurs faire découvrir des territoires, thématiques, espèces, milieux, organisations professionnelles ou amateurs. Cela peut débloquer des idées de stages (mais la sélection ne doit pas s'attarder à se demander si la source est pourvoyeuse de stages). 

## Territoire

Pas de restriction stricte à la Bretagne — le carnet couvre le national et
l'international quand le sujet le justifie (référentiels, grandes études,
espèces embarquées) — mais une **actualité régionale ou locale
(Bretagne, Morbihan) est à privilégier à sujet égal**, parce qu'elle
résonne davantage avec les sorties terrain des étudiants. 

## Les 4 rubriques

Reprendre exactement un de ces 4 libellés dans `rubrique` (texte libre côté
base, mais l'app et l'enseignant s'attendent à ces 4-là) :

- **Gestion** — plans de gestion, chantiers, budgets, réserves
  naturelles, opérations de génie écologique, restauration écologogique.
- **Science & protocoles** — suivis scientifiques, comptages, publications,
  méthodologie de terrain, résultats d'étude.
- **Données & référentiels** — cartographies, bases de données naturalistes,
  atlas, indicateurs, outils SIG, référentiels taxonomiques.
- **En bonus** — une trouvaille surprenante ou marquante, hors des trois
  cases précédentes, qui mérite d'être vue même si elle ne rentre dans
  aucune rubrique de gestion/science/données.

Idéalement il vaut mieux répartir les candidats entre les 4 rubriques plutôt que de tout concentrer
sur une seule — un numéro qui n'a que des « Gestion » est un
signal que la recherche a été trop étroite. Mais si la veille ne trouve qu'une seule rubrique ce n'est pas dramatique. 

## Sources à privilégier

Organismes producteurs de terrain, pas de médias généralistes qui relaient
sans creuser :

- **Conservatoires d'espaces naturels** (CEN, dont CEN Bretagne) et leur
  fédération (FCEN).
- **Parcs nationaux** (Cévennes, Écrins, etc.) et **parcs naturels
  régionaux** (dont PNR d'Armorique) et leur fédération (FPNR).
- **Réserves naturelles nationales et régionales**, individuellement.
- **Associations naturalistes départementales et régionales**
  (ex. Bretagne Vivante, GMB — Groupe Mammalogique Breton, VivArmorique).
- **Offices et établissements publics** : OFB (Office français de la
  biodiversité), agences de l'eau, DREAL.
- **Muséum national d'Histoire naturelle** et ses portails de données
  (INPN notamment).
- Structures de recherche publiant des résultats de terrain accessibles
  (universités, CNRS, stations marines).

Cette liste est un point de départ, pas une liste fermée — une source
sérieuse et pertinente qui n'y figure pas encore reste un bon candidat.
Des articles d'opinions ou tribune, même sans données de terrain, des positions politiques voire polémique sans aussi bienvenus. 
le carnet de veille est aussi un espace de découverte, voire de positionnement, par rapport à des tendances politiques dans le champs de la protection de la nature/écologie scientifique. 

## Critères d'exclusion explicites

Rejeter d'emblée, ne pas proposer en candidat :

- Article sans lien vers une source primaire vérifiable (communiqué,
  rapport, page officielle) — un relais de relais ne suffit pas.
- Contenu à but commercial, promotionnel ou publicitaire.
- Actualité déjà proposée dans un numéro précédent, sauf mise à jour
  factuelle notable (nouveaux chiffres, suite de l'histoire).
- Lien vers un site qui demande une inscription/un paywall pour lire
  l'essentiel du contenu.

## Ce qui fait un bon « Usage en cours »

Champ **privé**, réservé à l'enseignant, jamais publié — voir la règle
`usage_en_cours` de `CLAUDE.md` et la vue `affut_entrees_public` qui
l'exclut structurellement. C'est le texte le plus important à bien
écrire : il doit donner à l'enseignant une **piste d'exploitation
pédagogique concrète**, pas un résumé redondant avec le résumé public.

Bons réflexes (voir les deux exemples de `carnetveille.html`) :
- Donner un chiffre brut sans son contexte et faire deviner/discuter avant
  de révéler l'explication.
- Faire recalculer, faire répartir un budget entre postes, faire comparer
  une estimation à un résultat réel.
- Pointer une limite méthodologique exploitable en cours (limites d'un
  comptage ponctuel, biais d'échantillonnage, etc.).
- Relier explicitement à une compétence ou un module du référentiel BTS
  GPN quand c'est évident (gestion, suivi, police de l'environnement...).
- Proposer une discussion sur un sujet qui fait débat. 

Une ou deux phrases suffisent. Pas besoin de rédiger un scénario de
séance complet.

## Format de sortie attendu

Un candidat correspond exactement à un objet de `affut_numeros.moisson`
(tableau JSON), qui devient une ligne `affut_entrees` une fois retenu par
l'enseignant (voir le code du bouton « Retenir »,
`apps/affut/index.html`, autour de `data-action="retenir-candidat"`) :

```json
{
  "id": "identifiant unique et stable (slug court, ex. 2026-w36-cen-alsace-plan-gestion)",
  "rubrique": "Gestion | Science & protocoles | Données & référentiels | En bonus",
  "origine": "auto",
  "source": {
    "nom": "Nom de l'organisme producteur",
    "territoire": "Région/département, ou vide si national/international",
    "domaine": "nom de domaine de l'URL, sans www.",
    "date": "date de publication de la source (pas de la collecte), AAAA-MM-JJ"
  },
  "url": "URL de la source primaire, vérifiée accessible (pas de 404, pas de redirection vers une page de connexion)",
  "lienMort": false,
  "lienMortDepuis": null,
  "titre": "titre factuel, pas racoleur",
  "chiffres": ["valeur | libellé", "..."],
  "resume": "résumé factuel court, 2-4 phrases, sans opinion",
  "usage": "piste pédagogique privée, voir section ci-dessus"
}
```

`id` doit rester stable d'une exécution à l'autre pour la même actualité
(pour permettre une future dé-duplication) — dérivé du numéro de semaine,
de la source et d'un fragment du titre plutôt que d'un identifiant
aléatoire.

## Boucle de retour

À chaque exécution, avant de chercher, relire un échantillon récent des
décisions de l'enseignant (candidats retenus vs écartés, avec leur motif
d'écart quand il a été renseigné — voir le Lot 8 dans
`apps/affut/AVANCEMENT.md` pour l'état de cet historique) pour ajuster le
tri : quelles sources reviennent souvent écartées, quels types de sujets
sont systématiquement retenus. C'est de l'apprentissage en contexte à
chaque exécution, pas un réglage qui persiste entre deux exécutions.

## Ce que l'agent ne fait jamais

- Ne publie jamais un numéro (`statut` reste `brouillon` jusqu'au geste
  humain de publication).
- N'écrit jamais dans `usage_en_cours` un contenu qui pourrait être publié
  tel quel si le champ venait à fuiter — toujours écrit comme une note
  interne, jamais comme une phrase editoriale prête à l'affichage public.
- N'invente jamais de chiffre : un chiffre dans `chiffres` doit être
  repris tel quel de la source, pas déduit/estimé par l'agent.
- Ne modifie jamais une entrée déjà validée par l'enseignant (`valide:
  true`) — l'agent n'écrit que dans `moisson`, jamais directement dans les
  entrées publiées d'un numéro déjà en cours de rédaction.
