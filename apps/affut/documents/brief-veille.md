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

L'agent ne décide jamais seul de ce qui est bon : il propose une liste de
candidats plausibles. L'enseignant doit pouvoir trier en quelques minutes un
samedi matin.

## Volume attendu (révisé le 12/09/2026)

**Viser 15 à 20 candidats par exécution, et dépasser 20 quand la matière de
la semaine le permet.** Mieux vaut proposer large et laisser l'enseignant
écarter : le tri est rapide, la recherche ne l'est pas.

⚠️ **Cette fourchette prime sur toute fourchette plus basse qui figurerait
encore dans le prompt de la routine planifiée** (la version d'origine
demandait « 6 à 10 » — chiffre abandonné après le numéro 4, jugé trop
étroit). Le prompt de la routine désigne lui-même ce fichier comme faisant
foi : en cas de contradiction sur le volume, c'est la présente section qui
s'applique.

Ce volume ne relâche rien sur la qualité : tout candidat reste strictement
conforme au reste du brief, et un candidat faible se jette plutôt que de
gonfler le nombre. Il change en revanche l'équilibre de l'effort — c'est la
**recherche ouverte** (`WebSearch`, section « Sources à privilégier ») qui
doit fournir le gros du volume, pas les seules « Sources à moissonner en
priorité » — la plupart des semaines, seule leur part hebdomadaire (une
quinzaine d'adresses) est renvoyée par le `GET`, trop peu nombreuse pour y
suffire. Compter au minimum
une quinzaine de requêtes `WebSearch` distinctes, sur des organismes et des
thématiques absents de cette liste.

Conséquences sur la répartition, à ce volume :

- couvrir **plusieurs rubriques** de `rubriques_connues`. Un numéro de 15+
  candidats qui ne sortirait que deux ou trois rubriques signale une
  recherche trop étroite : élargir les requêtes plutôt que forcer le
  classement (la tolérance « pas grave si une seule ressort » de la section
  « Les rubriques » visait un numéro de 6 à 10, elle ne vaut plus ici) ;
- viser une part **régionale (Bretagne, Morbihan)** sensiblement plus
  fournie qu'une ou deux entrées.

Côté technique, l'Edge Function plafonne à **20 candidats par appel** et
rejette la totalité de l'envoi au-delà : découper en plusieurs `POST`
successifs. Voir `apps/affut/supabase/functions/affut-veille/README.md`.

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

## Les rubriques

Depuis le 05/09/2026, la liste des rubriques n'est plus figée à 4 : l'écran
de rédaction propose une liste déroulante qui se complète elle-même (voir
`rubriquesConnues()` dans `apps/affut/index.html`), avec une option
« + Nouvelle rubrique… » pour en créer une vraiment inédite. Le `GET` de la
fonction Edge renvoie ce même référentiel dans `rubriques_connues` (les 4
de base toujours en tête, puis les autres déjà en usage, triées).

**Priorité stricte : réutiliser une rubrique de `rubriques_connues` plutôt
qu'en inventer une nouvelle.** N'en proposer une inédite dans `rubrique` que
si le candidat ne rentre vraiment dans aucune de celles listées — comme
pour l'écran de rédaction, une nouvelle rubrique doit rester rare et
justifiée, pas une reformulation d'une existante (ex. ne pas créer
« Suivi scientifique » si « Science & protocoles » convient déjà).

Les 4 rubriques de base, toujours présentes dans `rubriques_connues` même
sans usage récent :

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

> Guide de **recherche ouverte** (`WebSearch`) — catégories d'organismes à
> chercher, pas des adresses précises. Les adresses précises à visiter une
> à une (y compris les revues/bulletins, fusionnés ici le 12/09/2026, voir
> plus bas) vivent **uniquement** dans l'écran « Sources » de l'app
> (table `affut_sources_suivies`) — c'est la seule liste d'adresses de tout
> ce brief, pour éviter la confusion entre deux mécanismes qui portaient
> presque le même nom (voir AVANCEMENT.md, Lot « une seule liste »).

Organismes producteurs de terrain, pas de médias généralistes qui relaient
sans creuser :

- **Conservatoires d'espaces naturels** (CEN, dont CEN Bretagne) et leur
  fédération (réseau CEN) — beaucoup de CEN régionaux publient une lettre
  d'information régulière (ex. Hauts-de-France, Normandie, Pays de la
  Loire, Centre-Val de Loire, Alsace, Champagne-Ardenne — *L'Azuré*,
  Franche-Comté, Occitanie, PACA, Auvergne — *Sylvae*) : un bon terrain de
  recherche pour la rubrique Gestion.
- **Parcs nationaux** (Cévennes, Écrins, Calanques, Mercantour, Forêts,
  Port-Cros, Guyane, etc.) et **parcs naturels régionaux** (dont PNR
  d'Armorique) et leurs fédérations (FPNR).
- **Réserves naturelles nationales et régionales**, individuellement.
- **Associations naturalistes départementales et régionales**
  (ex. Bretagne Vivante, GMB — Groupe Mammalogique Breton, VivArmorique,
  mais aussi hors Bretagne : Picardie Nature, GON, GRETIA, Manche-Nature,
  Nature en Occitanie, LPO régionales notamment *Faune-PACA Publication*,
  LPO Auvergne-Rhône-Alpes, LPO Poitou-Charentes/*L'Outarde*).
- **Offices et établissements publics** : OFB (Office français de la
  biodiversité), agences de l'eau, DREAL.
- **Muséum national d'Histoire naturelle** et ses portails de données
  (INPN, PatriNat), ainsi que **Vigie-Nature** / le programme OPEN.
- **Sociétés savantes et fédérations thématiques** : SFE² (Société
  française d'écologie), SFEPM (mammifères), OPIE (insectes), Tela
  Botanica (botanique).
- Structures de recherche publiant des résultats de terrain accessibles
  (universités, CNRS, INRAE, stations marines).
- **Textes réglementaires et consultations publiques** (Légifrance/JO :
  arrêtés espèces protégées, espèces exotiques envahissantes,
  dérogations ; consultations publiques du ministère) — utile pour la
  rubrique Gestion, terrain rarement exploré sinon.
- Médias spécialisés, à condition de toujours recouper avec la source
  primaire qu'ils citent (ex. Actu-Environnement rubrique biodiversité,
  La Gazette des communes) — ne remplacent jamais un organisme producteur.

**Portails d'observation participative (réseau Biolovision/VisioNature :
Faune-France, Faune-Bretagne, Faune-Alsace, Faune-Guyane, ornitho.ch...)** :
bons sujets de recherche ouverte (ex. « observation remarquable
faune-bretagne 2026 »), mais **jamais comme adresse dans l'onglet
Sources** — leur contenu est chargé en JavaScript après coup, invisible à
une visite en « page suivie » ou en flux RSS (vérifié techniquement, voir
la mémoire projet `affut-veille-sites-compatibles`).

Cette liste est un point de départ, pas une liste fermée — une source
sérieuse et pertinente qui n'y figure pas encore reste un bon candidat.
Des articles d'opinions ou tribune, même sans données de terrain, des positions politiques voire polémique sans aussi bienvenus. 
le carnet de veille est aussi un espace de découverte, voire de positionnement, par rapport à des tendances politiques dans le champs de la protection de la nature/écologie scientifique. 

## Sources à moissonner en priorité (écran « Sources »)

Le contexte (`GET`, voir `apps/affut/supabase/functions/affut-veille/README.md`)
renvoie un champ `sources_a_moissonner` : la liste que l'enseignant compile à
la main dans l'appli, onglet **Sources**. Chaque entrée porte `nom`,
`adresse` (URL d'une page ou d'un flux RSS), `type` (« flux RSS » ou « page
suivie »), `echelle`, `territoire`, `rubrique_defaut`. **C'est la seule liste
d'adresses à visiter de tout ce brief** — jusqu'au 12/09/2026 il existait
une seconde liste statique ici même (catalogue de 137 revues et bulletins,
visité une fois par mois) : elle a été fusionnée dans cette même table
(`periodicite = 'mensuelle'`, voir migration
`supabase/013-sources-suivies-periodicite.sql`) pour ne plus avoir deux
mécanismes à retenir sous des noms presque identiques.

Contrairement à la section « Sources à privilégier » ci-dessus (point de
départ pour une recherche ouverte), celle-ci est une **consigne, pas une
suggestion** : à chaque exécution, visiter effectivement chaque adresse
**dont la périodicité s'applique cette semaine** (lire le flux RSS, ou
parcourir la page suivie) et regarder ce qui y est récent. Le `GET` a déjà
fait le tri — il ne renvoie que les sources hebdomadaires plus, les
semaines où c'est pertinent, les mensuelles (revues/bulletins qui paraissent
au trimestre ou à l'année : les revisiter chaque semaine serait une perte de
temps, la plupart n'ayant rien de neuf) — ne pas essayer de deviner
autrement quelles sources visiter. Une source de cette liste sans nouveauté
publiable cette semaine n'est pas une erreur — ne rien proposer plutôt que
forcer un candidat faible.

Un candidat trouvé via une de ces sources reprend par défaut sa `rubrique`,
`territoire` et `echelle` (ajustables si l'article le justifie clairement).
Si une adresse est inaccessible (404, site down, redirection de connexion),
ne pas insister ni la remplacer par une autre — le signaler dans le
résumé de fin d'exécution pour que l'enseignant la corrige lui-même dans
l'écran Sources.

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
  "rubrique": "une valeur de rubriques_connues (GET) — voir section « Les rubriques » ci-dessus",
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
  "titre": "titre de la source, repris tel quel — voir règle ci-dessous",
  "chiffres": ["valeur | libellé", "..."],
  "resume": "citation tronquée du début de l'article, terminée par « [...] » — voir règle ci-dessous",
  "usage": "piste pédagogique privée, voir section ci-dessus"
}
```

`id` doit rester stable d'une exécution à l'autre pour la même actualité
(pour permettre une future dé-duplication) — dérivé du numéro de semaine,
de la source et d'un fragment du titre plutôt que d'un identifiant
aléatoire.

**Règle du 05/09/2026, précisée le même jour après un essai sur les
numéros 1 et 2 (titre et résumé ne doivent pas dispenser d'ouvrir la
source)** : le but de la tuile publiée est de donner envie de lire la
source, pas de la remplacer. Deux points à respecter strictement :

- **`titre`** : reprendre le titre effectif de la source (ou une traduction
  fidèle si la source est en langue étrangère), **jamais une reformulation
  ou un titre « amélioré »**. Ne pas raccourcir en gardant un sous-ensemble
  qui change le sens ; en cas de titre de source trop long pour l'affichage,
  le garder tel quel plutôt que de le réécrire — c'est à l'enseignant de le
  retoucher en rédaction s'il le juge nécessaire.
- **`resume`** : **une citation, pas un résumé au sens classique.** Recopier
  verbatim les toutes premières phrases du texte de la source (le chapô ou
  le début du corps de l'article, 1 à 3 phrases, environ 150-350
  caractères), puis couper avec « [...] » — y compris en plein milieu d'une
  phrase si besoin, pour un effet délibéré de suspense qui donne envie
  d'ouvrir la source pour lire la suite. Pas de paraphrase : le texte cité
  doit être fidèle au mot près (une correction de coquille/typo évidente de
  l'extraction est acceptable). Si aucun texte exploitable n'est
  récupérable (page JS-only, PDF non lisible), garder le champ le plus
  proche possible d'une citation malgré tout plutôt que de reformuler.
  Validé le 05/09/2026 après test sur les numéros 1 et 2 (voir
  [[affut-fusion-veilles-2026-09-05]]) — remplace l'ancienne consigne
  « résumé volontairement partiel » qui laissait trop de latitude pour
  paraphraser. Cette règle ne change rien aux cases à cocher « Afficher les
  chiffres clés »/« Afficher le résumé » de l'écran de rédaction (elles
  restent disponibles telles quelles) : c'est le contenu du champ `resume`
  lui-même qui doit être une citation tronquée, pas son masquage.

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
