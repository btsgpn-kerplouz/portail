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
priorité » — même avec la rotation mensuelle (environ 14 hebdomadaires +
un tiers des ~137 mensuelles, soit une soixantaine d'adresses par
exécution), une bonne partie n'aura rien de neuf une semaine donnée, trop
aléatoire pour y suffire seule. Compter au minimum
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

### Rubrique approuvée en plus des 4 de base (26/09/2026)

- **Animation & médiation** — éducation à l'environnement, animation
  nature, sciences participatives encadrées, aires éducatives, accueil du
  public et gestion de la fréquentation, valorisation et interprétation du
  patrimoine naturel, ressources pédagogiques, manifestations et
  événementiel naturaliste (festivals, chantiers participatifs, temps forts
  nationaux). Tout ce qui relève du **geste de médiation** plutôt que du
  geste de gestion ou de suivi.

Cette rubrique est **explicitement autorisée** : l'agent l'emploie comme
n'importe quelle valeur de `rubriques_connues`, sans la traiter comme une
« nouvelle rubrique » au sens de la priorité stricte ci-dessus. Elle ne
figure pas dans `RUBRIQUES_CANONIQUES` (code de l'écran de rédaction et de
la fonction Edge) : elle n'apparaîtra donc dans `rubriques_connues` qu'une
fois une première entrée retenue par l'enseignant, ce qui est le
fonctionnement normal — d'ici là, s'appuyer sur la présente section.

Ne pas la confondre avec **Evènement**, qui reste la simple annonce d'un
rendez-vous daté. « Animation & médiation » porte le fond : comment on
s'adresse au public, avec quels outils, pour quel résultat.

Idéalement il vaut mieux répartir les candidats entre les rubriques plutôt que de tout concentrer
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

### Axe « animation, médiation et valorisation » (ajouté le 26/09/2026)

Cet axe est à traiter **à chaque exécution, au même titre que les autres
catégories ci-dessus** — pas en complément optionnel quand il reste du
temps. Il alimente principalement la rubrique **Animation & médiation**
(voir « Les rubriques »), et fait découvrir aux étudiants une famille de
métiers que la veille couvrait mal jusqu'ici : animateur nature, chargé de
médiation, garde-animateur, chargé d'accueil et de fréquentation.
Compter **au moins deux ou trois requêtes `WebSearch` dédiées** dans la
quinzaine minimale déjà demandée. Organismes et terrains à chercher :

- **Réseaux d'éducation à l'environnement (EEDD)** : FRENE au national, et
  les réseaux régionaux — REEB en Bretagne, GRAINE (Pays de la Loire,
  Occitanie, Hauts-de-France…), Réseau Empreintes en Normandie, URCPIE.
- **CPIE** (Centres permanents d'initiatives pour l'environnement), au
  national comme localement, notamment pour leurs sciences participatives.
- **Aires éducatives** (aires marines et terrestres éducatives, OFB +
  Éducation nationale), **Vigie-Nature École**, Eco-École/Teragir, et plus
  largement les programmes de sciences participatives encadrés en classe.
- **Accueil du public et gestion de la fréquentation** : Réseau des Grands
  Sites de France, Rivages de France, portail des parcs nationaux,
  Conservatoire du littoral, gestionnaires de réserves sur leurs volets
  accueil, sentiers, capacité de charge, surfréquentation.
- **Manifestations et temps forts naturalistes** : Fête de la Nature, Jour
  de la Nuit, Nuit internationale de la chauve-souris, Fréquence Grenouille,
  festivals de film nature (Ménigoute, Natur'Armor…), chantiers
  participatifs, fêtes et congrès de réseaux.
- **Médiation scientifique et interprétation** : muséums et centres de
  culture scientifique, maisons de site et maisons de parc, réserves de
  biosphère (MAB France), structures d'interprétation du patrimoine.

Privilégier ici, comme ailleurs, ce qui a du fond : bilan d'animation,
retour d'expérience, évaluation de dispositif, ressource pédagogique
publiée, chiffres de fréquentation. C'est le champ qui produit le plus
d'`agenda` et de `breve` au sens de la section « Format de chaque
candidat » : appliquer ici exactement la même règle que partout ailleurs
(voir « Boucle de retour ») — chercher le document complet derrière
l'annonce, et ne rien proposer plutôt que de remplir avec trois lignes de
programme. La rubrique **Evènement** reste disponible pour un rendez-vous
daté qui mérite d'être signalé malgré tout.

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
renvoyée (lire le flux RSS, ou parcourir la page suivie) et regarder ce qui
y est récent. Le `GET` a déjà fait le tri — il ne renvoie que les sources
hebdomadaires (à chaque exécution) plus un **tiers, par rotation, des
sources mensuelles** (revues/bulletins qui paraissent au trimestre ou à
l'année, ~137 lignes : les revisiter toutes chaque semaine serait une perte
de temps et de crédits, la plupart n'ayant rien de neuf — mais les revisiter
toutes le même jour une fois par mois ferait un pic de ~150 adresses en une
exécution ; la rotation par tiers, un groupe différent chaque semaine
ISO — voir `groupeRotation()`/`numeroSemaineIso()` dans `index.ts` —,
répartit la charge). Ne pas essayer de deviner autrement quelles sources
visiter : la liste renvoyée est déjà la bonne pour cette semaine. Une
source de cette liste sans nouveauté publiable cette semaine n'est pas une
erreur — ne rien proposer plutôt que forcer un candidat faible.

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
  "format": "un code de formats_autorises (GET) — obligatoire, voir section « Format de chaque candidat » ci-dessous",
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

Le champ `format` (ajouté le 26/09/2026) est **obligatoire** dans tout
candidat : voir la section « Format de chaque candidat » plus bas pour les
codes et la façon de choisir. Le serveur tolère son absence (le candidat est
gardé, « non classé »), mais un candidat sans format prive la boucle
d'apprentissage de sa mesure.

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

**Règle du 19/09/2026 — `chiffres` : un teaser, pas un résumé chiffré.**
Même logique que pour `titre` et `resume` : la tuile donne envie d'ouvrir la
source, elle ne la remplace pas. Les propositions précédentes alignaient
souvent 5 à 8 chiffres, chacun quasi une phrase — la ligne débordait de la
tuile et dispensait de lire la source. Désormais :

- **0 à 3 chiffres par candidat, jamais plus.** Un seul suffit souvent. Ne
  garder que le ou les plus frappants, le plus marquant en premier. Une
  source sans chiffre parlant → tableau vide `[]`, ce n'est pas un défaut.
- **Chaque élément est court** : `valeur` de 1 à 3 mots (« 770 », « 65 205 € »,
  « 18 mois »), `libellé` de 1 à 4 mots (« chauves-souris comptées »,
  « plan de gestion »). **Environ 40 caractères au total pour `valeur | libellé`,
  60 au grand maximum.** Un chiffre qui demande une subordonnée (« dont … »,
  « soit … contre … ») n'est pas un chiffre clé : le couper ou l'écarter.
- **Pas de contexte qui explique le chiffre** : c'est justement ce que la
  source apporte. Donner la valeur et son objet, pas sa cause ni sa conclusion.
- Les chiffres restent repris tels quels de la source (règle « Ce que l'agent
  ne fait jamais » ci-dessous) : choisir parmi ceux de la source, ne pas en
  fabriquer un plus court par calcul ou arrondi.

## Ne jamais reproposer ce qui a déjà été vu

Le `GET` renvoie `urls_deja_utilisees` (adresses de tout ce qui a été retenu,
écarté ou est en attente, depuis le début) et `titres_deja_vus` (les 300 plus
récents). **Avant de rédiger un candidat, vérifier qu'il n'y figure pas** —
ni à la même adresse, ni sous un titre équivalent à une autre adresse (site
d'origine et relais, communiqué repris par la presse). Le serveur refuse de
toute façon un candidat déjà vu (réponse `doublons`, avec la `raison`), mais
un candidat rédigé pour rien est du temps perdu.

Un article **écarté** reste écarté, quel que soit le temps écoulé : ne pas le
reproposer sous prétexte qu'il est plus ancien dans l'historique. Si une
source déjà écartée publie une **version nettement plus complète** du même
sujet (rapport intégral après une brève), c'est un nouveau document à
proposer, avec sa propre adresse.

## Format de chaque candidat (obligatoire depuis le 26/09/2026)

Chaque candidat porte un champ `format`, à choisir **uniquement** parmi les
codes de `formats_autorises` renvoyés par le `GET` (liste fermée, avec une
définition pour chacun). Le choix se fait sur le **contenu de la page
elle-même**, pas sur la réputation de la source :

- `breve` : quelques lignes, peu ou pas de développement, souvent un simple
  résumé qui renvoie vers un document complet. Un bon critère : si l'on ne
  peut tirer ni chiffre ni fait précis au-delà du titre, c'est une brève.
- `rapport_etude` / `article_fond` / `publication_scientifique` : contenu
  développé, avec données, méthode ou analyse.
- `texte_officiel`, `agenda`, `tribune`, `donnees_outil`, `multimedia` : voir
  les définitions du `GET`.
- `autre` : en dernier recours seulement.

Un format hors liste est retiré par le serveur (le candidat est gardé, mais
non classé) et signalé dans `avertissements` : ne pas en inventer.

## Règles éditoriales de l'enseignant (depuis le 26/09/2026)

Le `GET` renvoie `regles_editoriales` : une courte liste de règles écrites par
l'enseignant dans l'espace « Mémoire de la veille » de l'onglet Sources de l'app (ou acceptées après
proposition). **À lire en entier avant de chercher, à chaque exécution, et à
appliquer comme des consignes de tri, pas comme des suggestions.** Elles
**prévalent sur tout ce qu'on déduit des chiffres** (`bilan_par_format`,
motifs) : si un format est plutôt retenu mais qu'une règle en exclut un cas,
c'est la règle qui gagne. En cas de conflit avec ce brief, signaler le
conflit dans le compte rendu plutôt que de trancher seul.

`regles_editoriales` vaut `null` (et non une liste vide) quand la fonctionnalité
n'est pas encore installée : dans ce cas, l'ignorer sans en faire une erreur.

### Proposer une règle (une fois par mois, jamais plus)

Uniquement quand le `GET` renvoie `peut_proposer_des_regles: true` (premier
samedi du mois, et l'enseignant a déjà tranché les propositions précédentes).
Sinon, ne rien proposer, même si un motif revient souvent.

Une bonne proposition est **une consigne de tri sur un type de contenu**,
appuyée par un constat chiffré tiré de `motifs_ecart_frequents` et de
`bilan_par_format` (au moins 5 décisions concordantes — moins, c'est du
hasard). Exemple : `« Ne pas proposer de communiqué sans données chiffrées. »`,
justification : `« 8 des 10 écarts de ce type depuis septembre, motif
"pas de données". »`

À respecter absolument :

- **jamais de règle sur une source** (« éviter tel site », « préférer telle
  revue ») ni d'adresse : le serveur refuse toute proposition qui en contient.
  Toutes les sources restent visitées ;
- 3 propositions au plus par envoi, formulées comme une consigne claire à un
  collègue, sans jargon technique ;
- ne pas reproposer une règle déjà en vigueur ni une règle de
  `propositions_refusees` : une règle refusée par l'enseignant est définitivement
  écartée, même sous une autre formulation.

Envoi (un seul type de contenu par appel : soit des candidats, soit des
propositions) :

```
POST … -d '{"propositions": [{"texte": "…", "justification": "…"}]}'
```

La proposition atterrit **en attente** : elle n'entre jamais d'elle-même dans
les règles en vigueur. Réponse `409` s'il reste des propositions non
tranchées : ne pas insister.

## Boucle de retour — apprendre des FORMATS, jamais des sources

À chaque exécution, avant de chercher, lire dans le `GET` :

- `bilan_par_format` : pour chaque format, combien de candidats ont été
  retenus et combien écartés depuis le début ;
- `motifs_ecart_frequents` : les raisons d'écart choisies par l'enseignant
  (`trop_court`, `pas_de_donnees`, `hors_sujet`, `agenda`, `trop_local`,
  `redondant`, `autre`) ;
- `candidats_ecartes_recents` (avec `motif`, `motif_code`, `format`) et
  `entrees_retenues_recentes`, pour les cas concrets.

Et **ajuster la recherche en conséquence**, par exemple :

- un format presque toujours écarté (ex. `breve` avec le motif `trop_court`)
  ne se propose plus seul : chercher plutôt le **document complet** vers
  lequel la brève renvoie (rapport, étude, dossier), et ne rien proposer si
  on ne le trouve pas ;
- un format presque toujours retenu (ex. `rapport_etude`) mérite d'être
  cherché plus activement, y compris hors des sources habituelles ;
- un motif qui revient (ex. `pas_de_donnees`) est une consigne de tri à
  appliquer **avant** de proposer, pas après.

**Règle absolue : ne jamais déduire une préférence pour ou contre une
source.** Une très bonne source publie aussi des contenus trop courts ; c'est
le contenu qui est écarté, pas la source. Aucun compteur par source n'est
fourni, et l'on ne doit pas en reconstituer un à partir des exemples récents
(« cette source est souvent écartée », « celle-ci est toujours retenue » sont
des conclusions interdites). Toutes les sources suivies restent visitées selon
leur périodicité, quel que soit l'historique.

Tant que les nouvelles colonnes ne sont pas encore remplies (les décisions
d'avant le 26/09/2026 n'ont ni format ni motif codé), `bilan_par_format` peut
être `null` ou dominé par « non_classe » : dans ce cas, se fier aux motifs
libres des écartés récents et au bon sens éditorial de ce brief.

C'est de l'apprentissage en contexte à chaque exécution, pas un réglage qui
persiste entre deux exécutions : la mémoire durable, c'est l'historique en
base (formats et motifs) et ce brief.

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
