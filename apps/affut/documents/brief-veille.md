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

> Section enrichie le 05/09/2026 par fusion avec la liste de sources du
> tout premier essai de veille (routine autonome antérieure au Lot 8,
> désactivée depuis — voir la mémoire projet `affut-lot8-veille-automatique`).
> Sert de guide de **recherche ouverte** (`WebSearch`) — ce n'est pas une
> liste d'adresses à visiter une à une (ça, c'est le rôle de la section
> suivante, « Sources à moissonner en priorité »).

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

## Revues et bulletins naturalistes (recherche mensuelle)

La plupart de ces revues paraissent au trimestre ou à l'année : ne les
consulter (recherche du dernier sommaire paru, recherche ouverte
`WebSearch`) qu'une fois par mois, à l'exécution qui correspond au premier
numéro du mois (voir `cible.mois`/`cible.semaine` renvoyés par le `GET`).
Un article de sommaire directement exploitable en cours devient un
candidat comme un autre, casé dans une des 4 rubriques habituelles — pas
besoin d'une 5e rubrique dédiée.

Liste complète (137 titres, récupérée le 05/09/2026 de l'annuaire constitué
pour l'ancienne veille autonome — voir [[affut-fusion-veilles-2026-09-05]]),
classée par territoire puis dans l'ordre national → régions. Pour chaque
titre : éditeur · thématique · accès (**libre** / mixte / adhérents-
abonnement) · périodicité, avec une note quand elle apporte une précision
utile. Une revue marquée « arrêtée » reste volontairement dans la liste :
ses archives sont une mine pour les inventaires anciens et les
comparaisons dans le temps, exploitable en cours même sans actualité
récente — mais elle ne mérite qu'une vérification occasionnelle, pas
mensuelle. Une revue marquée « parution incertaine » a une existence
confirmée mais une adresse ou une régularité non garanties lors de la
constitution de la liste : vérifier avant de conclure à un arrêt. Les
lettres d'information des CEN et des parcs, plus fréquentes et plus
proches du terrain que les revues à comité de lecture, sont aussi les plus
susceptibles de fournir un candidat exploitable directement.

### National

- [Naturae](https://sciencepress.mnhn.fr/fr/periodiques/naturae) — MNHN — Publications scientifiques · Généraliste · accès libre · flux continu
- [Cryptogamie, Bryologie](https://sciencepress.mnhn.fr/fr/periodiques/bryologie) — MNHN — Publications scientifiques · Mycologie & cryptogames · accès libre · flux continu (Accès ouvert intégral, modèle diamant.)
- [Biodiversité, des clés pour agir](https://professionnels.ofb.fr/fr/revues) — OFB · Gestion & ingénierie · accès libre · trimestriel (Succède à Espaces naturels et Faune sauvage.)
- [Espaces naturels](http://www.espaces-naturels.info/archives) — OFB · Gestion & ingénierie · accès mixte · trimestriel · arrêtée (Présentée par l'OFB comme ancienne revue ; archives toujours en ligne.)
- [Faune sauvage](https://professionnels.ofb.fr/fr/doc/revue-faune-sauvage) — OFB (ex-ONCFS) · Généraliste · accès libre · trimestriel · arrêtée (Ancienne revue, archives consultables.)
- [Cahiers techniques](https://cahiers-techniques.espaces-naturels.fr/) — OFB (collection ex-ATEN) · Gestion & ingénierie · accès libre · collection (Derniers titres identifiés vers 2017.)
- [Actualités et publications PatriNat](https://www.patrinat.fr/fr/recherche/type/actualite) — PatriNat (MNHN / OFB / CNRS / IRD) · Données & référentiels · accès libre · flux continu
- [Actualités et Regards](https://sfecologie.org/category/actu/) — SFE² — Société Française d'Écologie et d'Évolution · Généraliste · accès libre · flux continu
- [Plume de Naturalistes](https://www.plume-de-naturalistes.fr/numeros/) — Revue en ligne · Généraliste · accès libre
- [Les Carnets natures](https://carnetsnatures.fr/articles-publies.html) — ASNAT — Muséum de Gaillac · Généraliste · accès libre · volumes annuels
- [Le Courrier de la Nature](https://www.snpn.com/courrier-nature/) — SNPN · Généraliste · adhérents/abonnement · trimestriel
- [Zones Humides Infos](https://www.snpn.com/zones-humides-infos/) — SNPN · Zones humides · accès mixte (Dernier numéro identifié : n°109, décembre 2025.)
- [Revue d'Écologie (La Terre et la Vie)](https://www.snpn.com/) — SNPN · Généraliste · adhérents/abonnement · parution incertaine (Page dédiée non confirmée ; passer par le site de la SNPN.)
- [Espèces](https://especes.org/numeros/) — Kyrnos Publications · Généraliste · adhérents/abonnement · trimestriel
- [La Hulotte](https://www.lahulotte.fr/) — Éditions Passerage · Généraliste · adhérents/abonnement · semestriel
- [Martinia](https://martinia.insectes.org/martinia-archives/) — OPIE — groupe Odonates · Entomologie & invertébrés · accès libre (Odonatologie française et outre-mer.)
- [Insectes](https://insectes.org/la-revue-insectes/les-archives-de-la-revue/) — OPIE · Entomologie & invertébrés · accès libre · trimestriel (En accès libre numérique depuis 2025.)
- [L'Entomologiste](http://lentomologiste.fr/) — Société entomologique de France · Entomologie & invertébrés · adhérents/abonnement · bimestriel
- [MalaCo](https://journal-malaco.mnhn.fr/) — MNHN — malacologie continentale · Entomologie & invertébrés · accès libre
- [Bulletin de la SHF](https://lashf.org/bshf/) — Société Herpétologique de France · Herpétologie · accès libre (Entièrement numérique et gratuit.)
- [L'Envol des Chiros](https://www.sfepm.org/publications-sur-les-chauves-souris.html) — SFEPM · Mammifères & chiroptères · accès libre · irrégulier
- [Arvicola](https://www.sfepm.org/publications-la-sfepm-les-mammiferes.html) — SFEPM · Mammifères & chiroptères · adhérents/abonnement · irrégulier
- [Ornithos](https://www.lpo.fr/s-engager-a-nos-cotes/s-abonner-a-nos-revues/ornithos) — LPO · Ornithologie · adhérents/abonnement · trimestriel
- [Alauda](https://www.seof.fr/actualit-dalauda) — SEOF · Ornithologie · adhérents/abonnement
- [Revue forestière française](https://revueforestierefrancaise.agroparistech.fr/) — AgroParisTech · Forêt · accès libre (Également en libre accès sur DOAJ et HAL.)
- [Forêt & Innovation (ex-Forêt-entreprise)](https://www.cnpf.fr/se-former-s-informer/nos-publications/foret-entreprise-la-revue-du-cnpf) — CNPF / IDF · Forêt · accès mixte · 6 n°/an (Numéros de plus de deux ans en téléchargement libre.)
- [Rendez-vous techniques de l'ONF](https://www.onf.fr/onf/+/16c3::les-rendez-vous-techniques-de-lonf-numero-74.html) — Office National des Forêts · Forêt · accès libre · irrégulier (Lien vers un numéro ; naviguer depuis onf.fr pour la collection.)
- [Sciences Eaux & Territoires](https://revue-set.fr/about) — INRAE · Zones humides · accès libre · numéros thématiques (Accès ouvert intégral depuis 1995.)
- [Ecologia Mediterranea](https://ecologia-mediterranea.univ-avignon.fr/) — IMBE / Naturalia Publications · Gestion & ingénierie · accès mixte (Archives également sur Persée.)
- [Le Journal de Botanique](https://societebotaniquedefrance.fr/publications/le-journal-de-botanique/) — Société Botanique de France · Botanique & phytosociologie · adhérents/abonnement · 4 n°/an
- [La Garance voyageuse](https://garance-voyageuse.org/la-revue.html) — Association La Garance Voyageuse · Botanique & phytosociologie · adhérents/abonnement · trimestriel
- [Carnets botaniques](https://sbocc.fr/carnets-botaniques/) — Société Botanique d'Occitanie · Botanique & phytosociologie · accès libre · flux continu (Accès ouvert intégral, lancée en 2020.)
- [Documents phytosociologiques](http://www.phytosocio.org/#/doc-phyto/doc-phyto) — Société française de phytosociologie · Botanique & phytosociologie · adhérents/abonnement · annuel · parution incertaine (Conditions d'accès non confirmées.)
- [Bulletin de la Société Mycologique de France](https://www.mycofrance.fr/bulletin-de-la-smf/) — Société Mycologique de France · Mycologie & cryptogames · accès mixte · trimestriel (Numéros 1885-1990 en libre accès sur Gallica.)
- [Bulletin de l'Association Française de Lichénologie](https://www.sbco.fr/bulletin-de-association-francaise-de-lichenologie-50-1/) — AFL · Mycologie & cryptogames · adhérents/abonnement · parution incertaine (Site de l'AFL inaccessible en vérification ; lien vers une page tierce.)
- [Cahiers de Biologie Marine](https://cbm.sb-roscoff.fr/) — Station Biologique de Roscoff · Marin & littoral · adhérents/abonnement · 6 n°/an
- [Vie et Milieu](https://wwwphp.obs-banyuls.fr/Viemilieu/index.php/contents.html) — Observatoire océanologique de Banyuls · Marin & littoral · adhérents/abonnement · parution incertaine (Conditions d'accès non confirmées.)
- [Magazine Parcs](https://www.parcs-naturels-regionaux.fr/mediatheque/magazines) — Fédération des Parcs naturels régionaux · Gestion & ingénierie · accès libre · semestriel (Archives depuis 1997 ; n°97 en mars 2026.)
- [Actualités du réseau des CEN](https://reseau-cen.org/actualites/) — Fédération des Conservatoires d'espaces naturels · Gestion & ingénierie · accès libre · flux continu
- [A fleur d'Eau](https://bassinversant.org/przhmva/a-fleur-deau-la-newsletter-du-pole-relais-zones-humides-mares-et-vallees-alluviales/) — Pôle-relais zones humides Mares et Vallées Alluviales · Zones humides · accès libre
- [Escale](http://www.biodiversite-poitou-charentes.org/Lettre-d-info-Escale-no61-Pole-relais-zones-humides-du-FMA.html) — Pôle-relais zones humides — Forum des Marais Atlantiques · Zones humides · accès libre (Lien vers le n°61 ; collection à parcourir depuis le site du FMA.)

### Bretagne

- [Ar Vran](https://www.bretagne-vivante.org/decouverte-de-la-nature/nos-revues/) — Bretagne Vivante · Ornithologie · accès mixte · annuel
- [Penn ar Bed](https://www.bretagne-vivante.org/decouverte-de-la-nature/nos-revues/) — Bretagne Vivante · Généraliste · adhérents/abonnement · trimestriel (Paraît depuis 1953.)
- [Invertébrés Armoricains — Cahiers du GRETIA](http://www.gretia.org/index.php/connaissances/invertebres-armoricains-les-cahiers-du-gretia) — GRETIA · Entomologie & invertébrés · accès mixte · irrégulier (Couvre aussi Normandie et Pays de la Loire.)
- [Mammi'Breizh](https://gmb.bzh/type_doc/bulletin/) — Groupe Mammalogique Breton · Mammifères & chiroptères · adhérents/abonnement · semestriel
- [Le Râle d'eau](https://www.vivarmor.fr/lassociation/notre-bulletin-dinformation/) — VivArmor Nature · Généraliste · accès mixte · trimestriel (Côtes-d'Armor. Archives libres à partir du n°181.)
- [E.R.I.C.A.](https://www.cbnbrest.fr/espace-documentaire/erica) — Conservatoire botanique national de Brest · Botanique & phytosociologie · accès libre · annuel (Flore armoricaine ; n°40 paru en juillet 2026.)
- [Bulletin de liaison](https://finistere.lpo.fr/index.php/bulletin-de-liaison) — LPO Finistère · Ornithologie · adhérents/abonnement
- [Bulletin mycologique](https://bretagne-environnement.fr/organisme/Societe-mycologique-Rennes) — Société mycologique de Rennes · Mycologie & cryptogames · adhérents/abonnement · trimestriel · parution incertaine

### Pays de la Loire

- [Lettre d'information](https://cenpaysdelaloire.fr/lettre-d-information-0) — CEN Pays de la Loire · Gestion & ingénierie · accès libre · trimestriel
- [Le Crex](https://www.faune-paysdelaloire.org/index.php?m_id=20938) — LPO Anjou · Ornithologie · adhérents/abonnement
- [Sur les chemins de Lacampagne (ex-Le Tarier pâtre)](https://sarthe.lpo.fr/lpo-sarthe/nos-publications/tarier-patre-sur-les-chemins-de-lacampagne/) — LPO Sarthe · Ornithologie · accès libre · annuel (PDF disponibles depuis 2000.)
- [Le Naturaliste Vendéen](https://naturalistes-vendeens.org/revue-scientifique-le-naturaliste-vendeen/) — Les Naturalistes Vendéens · Généraliste · adhérents/abonnement · annuel (Faune, flore et paléontologie.)
- [La Gorgebleue / LPO infos Vendée](https://vendee.lpo.fr/nos-actions/informer/publications-de-lpo-vendee/) — LPO Vendée · Ornithologie · accès mixte
- [Publications naturalistes](https://www.mayennenatureenvironnement.fr/nos-publications/) — Mayenne Nature Environnement · Généraliste · adhérents/abonnement · parution incertaine
- [Cahiers Mycologiques](https://amo-nantes.fr/) — Association Mycologique de l'Ouest (Nantes) · Mycologie & cryptogames · accès libre · annuel (Numéros 1989-2022 en téléchargement gratuit.)
- [Anjou Nature](https://anjou-nature-la-revue-des-naturalistes-angevins-1.jimdosite.com/bulletins-publies) — Les Naturalistes Angevins · Généraliste · accès mixte · arrêtée (Cinq numéros ; arrêtée en 2015.)

### Normandie

- [Le Cormoran / Le Petit Cormoran](https://www.gonm.org/index.php?post/Le-Cormoran) — Groupe Ornithologique Normand · Ornithologie · adhérents/abonnement · mensuel (Petit Cormoran)
- [Le Petit Lérot](https://new.gmn.asso.fr/publications/) — Groupe Mammalogique Normand · Mammifères & chiroptères · adhérents/abonnement
- [Nature en sCENe Normandie](http://cen-normandie.fr/publications/la-vie-des-conservatoires/lettres-d-informations) — CEN Normandie · Gestion & ingénierie · accès libre
- [L'Argiope](https://manche-nature.fr/publications/) — Manche-Nature · Généraliste · adhérents/abonnement · trimestriel
- [Les Dossiers de Manche-Nature](https://manche-nature.fr/publications/) — Manche-Nature · Généraliste · adhérents/abonnement · irrégulier (Monographies thématiques ; 11 volumes depuis 1997.)
- [Bulletin de la SASNMR](https://sasnmr.fr/bulletins) — Amis des Sciences Naturelles et du Muséum de Rouen · Généraliste · adhérents/abonnement (Société fondée en 1865.)

### Centre-Val de Loire

- [Recherches Naturalistes](https://fne-centrevaldeloire.org/recherches-naturalistes) — FNE Centre-Val de Loire · Généraliste · adhérents/abonnement · irrégulier · parution incertaine (Dernier numéro repéré : n°13, mars 2022.)
- [Expli-Sites](https://www.cen-centrevaldeloire.org/telechargements/6-Bulletins-dinformations/) — CEN Centre-Val de Loire · Gestion & ingénierie · accès libre
- [Le P'tit Grav'](https://faune-indre-et-loire.org/index.php?langu=en&m_id=21127) — LPO Centre-Val de Loire · Ornithologie · adhérents/abonnement · annuel
- [Armeria](http://www.cpievaldeloire.org/armeria-bulletin-naturaliste/) — CPIE Touraine — Val de Loire · Généraliste · adhérents/abonnement
- [Bulletin annuel](https://www.perchenature.fr/wp-content/uploads/2025/01/bulletin-annuel-perche-nature-2023-red.pdf) — Perche Nature · Généraliste · accès libre · annuel (Lien vers l'édition 2023.)
- [GEAI](https://www.indrenature.net/nos-publications) — Indre Nature · Généraliste · adhérents/abonnement

### Hauts-de-France

- [L'Avocette](https://www.picardie-nature.org/l-association/picardie-nature-edition/l-avocette-revue-naturaliste-de/) — Picardie Nature · Généraliste · accès mixte · semestriel (Oiseaux, chiroptères, amphibiens de Picardie.)
- [Le Héron](https://gon.fr/ressources/) — Groupe Ornithologique et Naturaliste (GON) · Ornithologie · adhérents/abonnement · semestriel
- [Lettres d'infos des Hauts-de-France](https://www.cen-hautsdefrance.org/publications/les-lettres-d-infos-des-hauts-de-france) — CEN Hauts-de-France · Gestion & ingénierie · accès libre
- [Bulletin de la Société linnéenne Nord-Picardie](https://www.linneenne-amiens.org/?page_id=445) — Société linnéenne Nord-Picardie · Généraliste · accès libre · annuel (Botanique, faune, mycologie, habitats.)
- [Nature en Hauts-de-France](https://www.observatoire-biodiversite-hdf.fr/publications/nature-en-hauts-de-france) — Observatoire régional de la biodiversité · Données & référentiels · accès libre
- [Bulletin de la Société de botanique du nord de la France](https://societebotaniquenord.wordpress.com/) — SBNF · Botanique & phytosociologie · accès libre · annuel (Archives PDF, tomes 74 (2021) et 75 (2022).)
- [Documents Mycologiques](https://www.smnf.fr/index.php/les-documents-mycologiques-2/) — Société Mycologique du Nord de la France · Mycologie & cryptogames · adhérents/abonnement · arrêtée (Arrêt annoncé après le tome XXXVII (2019).)

### Grand Est

- [Ciconia](https://alsace.lpo.fr/index.php/nos-publications/livres) — LPO Alsace · Ornithologie · adhérents/abonnement · annuel (Écologie animale ; volumes numérotés depuis les années 1970.)
- [Magazine des 3 CEN](https://www.conservatoire-sites-alsaciens.eu/publications/magazine-des-3-cen/) — CEN Alsace, Lorraine et Champagne-Ardenne · Gestion & ingénierie · accès libre · annuel
- [Publications du CEN Alsace](https://www.conservatoire-sites-alsaciens.eu/publications/) — CEN Alsace (ex-CSA) · Gestion & ingénierie · accès libre
- [Espaces Naturels de Lorraine](https://cen-lorraine.fr/) — CEN Lorraine · Gestion & ingénierie · accès libre · plusieurs n°/an
- [Savart](https://cen-champagne-ardenne.org/telechargements) — CEN Champagne-Ardenne · Gestion & ingénierie · accès libre (Publié depuis 1990.)
- [Bulletin du Musée d'Histoire Naturelle de Colmar](https://www.museumcolmar.org/bulletin) — Musée d'Histoire Naturelle et d'Ethnographie de Colmar · Généraliste · accès libre · annuel
- [Publications BUFO](https://www.bufo-alsace.org/publication/) — BUFO — amphibiens et reptiles d'Alsace · Herpétologie · accès libre · série numérotée (Monographies de l'herpétofaune d'Alsace.)
- [Faune Champagne-Ardenne Infos](https://champagne-ardenne.lpo.fr/images/mediatheque/fichiers/Etudes/Connaissance/lettre_info_fca/9_faune_champagne-ardenne_info_decembre2017_fevrier2018.pdf) — LPO Champagne-Ardenne · Ornithologie · accès libre · parution incertaine (Dernier numéro localisé : n°9, 2017-2018.)

### Bourgogne-Franche-Comté

- [BFC Nature](https://bfcnature.fr/la-revue-scientifique-bfc-nature/) — Bourgogne-Franche-Comté Nature · Généraliste · accès mixte · semestriel (Numéros 1 à 36 gratuits dans la limite des stocks.)
- [Bulletin de la SHNA-OFAB](https://www.shna-ofab.fr/nos-publications/le-bulletin-de-la-societe/) — Société d'Histoire Naturelle d'Autun · Généraliste · accès mixte · semestriel (Anciens numéros sur Gallica.)
- [L'Azuré](https://cen-franchecomte.org/documentation/revues/lazure/) — CEN Franche-Comté · Gestion & ingénierie · accès libre · irrégulier (Revue des gestionnaires de milieux naturels remarquables.)
- [Le Sabot de Vénus](https://cen-franchecomte.org/documentation/revues/le-sabot-de-venus/) — CEN Bourgogne et CEN Franche-Comté · Gestion & ingénierie · adhérents/abonnement · semestriel
- [Échos des forêts](https://forets-parcnational.fr/fr/publications-et-documents) — Parc national de forêts · Forêt · accès libre · semestriel
- [La Feuille de Neomys](https://ressources.shna-ofab.fr/shna-ofab/fichiers__pdf_/3-ressources/1-publications/2-feuilles_de_neomys/1999_feuille_de_neomys_n3.pdf) — SHNA-OFAB · Mammifères & chiroptères · accès libre · parution incertaine (Micromammifères ; dernier numéro identifié ancien.)

### Île-de-France

- [Bulletin de l'ANVL](https://www.anvl.fr/nos-ressources/bulletins-de-lanvl/) — Naturalistes de la Vallée du Loing et du massif de Fontainebleau · Généraliste · accès libre · annuel
- [Le Passer](https://lpo-idf.fr/site/_fichiers/passer/LePasser_50_1.pdf) — LPO Île-de-France (ex-CORIF) · Ornithologie · adhérents/abonnement · semestriel (Lien vers un numéro ; collection sur lpo-idf.fr.)
- [L'Épeichette](https://www.lpo-idf.fr/site/_fichiers/epeichette/Epeichette_121.pdf) — LPO Île-de-France · Ornithologie · adhérents/abonnement · mensuel (Bulletin de liaison ; lien vers le n°121.)
- [Bulletin des Naturalistes Parisiens](https://www.lesnaturalistesparisiens.org/publications) — Les Naturalistes Parisiens · Généraliste · adhérents/abonnement · parution incertaine
- [Publications du CBNBP](https://cbnbp.mnhn.fr/cbnbp/ressources/publications.jsp) — Conservatoire botanique national du Bassin parisien · Botanique & phytosociologie · accès mixte (Couvre aussi Centre, Bourgogne et Champagne-Ardenne.)
- [Lettre d'information](https://www.cen-idf.fr/page/1674017-publications) — CEN Île-de-France · Gestion & ingénierie · accès libre · arrêtée (Interrompue après le n°26 (2021) ; nouvelle publication annoncée.)

### Nouvelle-Aquitaine

- [L'Outarde](https://www.lpo.fr/lpo-locales/la-lpo-en-nouvelle-aquitaine/lpo-poitou-charentes/nos-publications/revue-et-lettres-d-info-naturalistes2/l-outarde) — LPO Poitou-Charentes · Ornithologie · accès libre · annuel (PDF gratuits ; n°61 pour 2026.)
- [Le Courbageot](https://faune-aquitaine.org/index.php?item=17&m_id=1183) — LPO Aquitaine · Ornithologie · accès libre · irrégulier
- [La Cistude](https://www.ne17.fr/revue-la-cistude/) — Nature Environnement 17 · Généraliste · adhérents/abonnement · parution incertaine (Charente-Maritime ; conditions d'accès non confirmées.)
- [La revue naturaliste](https://dsne.org/nos-publications/la-revue-naturaliste/) — Deux-Sèvres Nature Environnement · Généraliste · adhérents/abonnement · parution incertaine
- [Le Casseur d'Os](http://www.xn--gopa-pyrnes-ibbb.fr/le-casseur-dos/) — Groupe Ornithologique des Pyrénées et de l'Adour · Ornithologie · adhérents/abonnement · annuel · parution incertaine (Site instable (boucles de redirection) ; existence de la revue confirmée par ailleurs.)
- [Actes de la Société Linnéenne de Bordeaux](https://linneenne-bordeaux.wixsite.com/slbx/bulletins) — Société Linnéenne de Bordeaux · Généraliste · accès mixte · 4 n°/an (Sommaires en libre accès, numéros vendus à l'unité.)
- [Bulletin de la Société de Borda](https://www.societe-borda.com/) — Société de Borda · Généraliste · adhérents/abonnement · trimestriel (Landes ; sciences naturelles et histoire locale.)
- [Centre de ressources documentaires](https://documentation.cbnsa.fr/opac_css/index.php) — CBN Sud-Atlantique · Botanique & phytosociologie · accès libre

### Occitanie

- [Ressources et publications](https://www.natureo.org/ressources/) — Nature en Occitanie · Généraliste · accès libre · ponctuel
- [Bulletin de la Société d'Histoire Naturelle de Toulouse](https://shnt.fr/bulletin.html) — SHNT · Généraliste · adhérents/abonnement (Toujours active (n°161 et suivants).)
- [Isatis](https://sbocc.fr/tout-isatis-dans-la-bibliotheque-de-la-sbocc/) — Société Botanique d'Occitanie · Botanique & phytosociologie · accès libre · annuel (Bibliothèque numérique depuis 2001.)
- [Lettres d'information](https://www.cen-occitanie.org/analyses-environnement-occitanie/) — CEN Occitanie · Gestion & ingénierie · accès libre · saisonnier
- [Empreintes](https://www.pyrenees-parcnational.fr/sites/pyrenees-parcnational.fr/files/2025-07/MAG_EMPREINTES_50_web.pdf) — Parc national des Pyrénées · Gestion & ingénierie · accès libre (Lien vers le n°50 (2025).)
- [Journal du Parc](https://www.cevennes-parcnational.fr/fr/journal-du-parc) — Parc national des Cévennes · Gestion & ingénierie · accès libre
- [Portail documentaire](https://biblio.cbnpmp.fr/) — CBN des Pyrénées et de Midi-Pyrénées · Botanique & phytosociologie · accès libre

### Provence-Alpes-Côte d'Azur

- [Faune-PACA Publication](https://paca.lpo.fr/association-protection-nature/s-informer/editions/faune-paca-publication) — LPO PACA · Généraliste · accès libre · très régulier (n°132 atteint mi-2025 ; études naturalistes et atlas.)
- [Garrigues](https://cen-paca.org/decouvrir/les-actualites/) — CEN PACA · Gestion & ingénierie · accès libre
- [La Nycteribie](https://www.gcprovence.org/wp-content/uploads/2024/07/2023_Nycteribie2022_VF_compresse-1.pdf) — Groupe Chiroptères de Provence · Mammifères & chiroptères · accès libre · annuel (Lien vers l'édition 2022-2023.)
- [Bulletin de la Société Linnéenne de Provence](https://www.linneenne-provence.org/bulletin.htm) — Société Linnéenne de Provence · Généraliste · accès libre · annuel (Articles également déposés sur Zenodo depuis 2026.)
- [Chroniques de Haute-Provence](https://livre.tourisme-alpes-haute-provence.com/societe-scientifique-et-litteraire/) — Société Scientifique et Littéraire des Alpes-de-Haute-Provence · Généraliste · adhérents/abonnement (Ex-Annales des Basses-Alpes ; n°389 et suivants.)
- [Magazine du Parc](https://mercantour-parcnational.fr/fr/categories-dactualite/publications) — Parc national du Mercantour · Gestion & ingénierie · accès libre
- [La Calanquaise](https://www.calanques-parcnational.fr/fr/publications-et-documents) — Parc national des Calanques · Gestion & ingénierie · accès libre · semestriel
- [Travaux scientifiques du Parc national de Port-Cros](https://www.portcros-parcnational.fr/fr/rapports-scientifiques) — Parc national de Port-Cros et Porquerolles · Marin & littoral · accès libre · annuel (Volume 37 récent.)
- [L'Attitude](https://www.portcros-parcnational.fr/fr/le-parc-national-de-port-cros/le-magazine-du-parc-national) — Parc national de Port-Cros et Porquerolles · Marin & littoral · accès libre

### Auvergne-Rhône-Alpes

- [L'Effraie](https://auvergne-rhone-alpes.lpo.fr/leffraie-la-revue-naturaliste-de-la-lpo-dans-le-rhone-61-nouveau-numero/) — LPO Rhône (LPO AuRA) · Ornithologie · accès libre (n°61 atteint.)
- [Le Grand-Duc](https://www.faune-aura.org/index.php?m_id=20283) — LPO Auvergne (LPO AuRA) · Ornithologie · accès mixte · annuel · parution incertaine (Parution après 2022 non confirmée.)
- [Biblio LPO AuRA](https://biblio.lpo-aura.org/) — LPO AuRA et partenaires · Données & référentiels · accès libre (Base documentaire : atlas, listes rouges, guides techniques.)
- [Bulletin mensuel de la Société Linnéenne de Lyon](https://www.linneenne-lyon.org/spip3/spip.php?rubrique23=) — Société Linnéenne de Lyon · Généraliste · adhérents/abonnement · mensuel
- [Bulletin mycologique et botanique Dauphiné-Savoie](https://fmbds.org/bulletin/) — Fédération mycologique et botanique Dauphiné-Savoie · Mycologie & cryptogames · accès mixte · trimestriel (Numéros antérieurs à 2010 en libre téléchargement.)
- [Sylvae](https://cen-auvergne.fr/publications/lettres-d-informations/lettre-d-information-sylvae) — CEN Auvergne · Gestion & ingénierie · accès libre
- [L'écho des Écrins](https://www.ecrins-parcnational.fr/actualite/lecho-des-ecrins-et-un-cahier-thematique-sur-les-sentiers) — Parc national des Écrins · Gestion & ingénierie · accès mixte · semestriel
- [Mail toutes fleurs](https://cbn-alpin.fr/actualites/mail-toutes-fleurs) — CBN alpin (Gap-Charance) · Botanique & phytosociologie · accès libre · parution incertaine (Archives s'arrêtant en 2013 mais toujours listée par le CBN.)
- [E-Folia et À fleur de massif](https://www.cbnmc.fr/33-ressources/96-suivre-notre-activite/97-supports-information/98-lettre-information) — CBN du Massif central · Botanique & phytosociologie · accès libre · parution incertaine
- [Journal Espaces naturels de Rhône-Alpes](https://www.cen-rhonealpes.fr/les-publications-du-conservatoire/espaces-naturels/) — CEN Rhône-Alpes · Gestion & ingénierie · accès libre · arrêtée (Dernier numéro repéré : n°22 (2019).)
- [Travaux scientifiques du Parc national de la Vanoise](https://www.vanoise-parcnational.fr/fr/des-connaissances/recueil-et-partage-des-connaissances/revue-des-travaux-scientifiques-du-parc) — Parc national de la Vanoise · Gestion & ingénierie · accès libre · arrêtée (24 volumes numérisés, 1970-2009 ; arrêt en 2013.)

### Corse

- [Bulletin de la Société des Sciences Historiques et Naturelles de la Corse](https://www.societesciencescorse.fr/les-publications/) — SSHNC · Généraliste · adhérents/abonnement (Paraît sans interruption depuis 1881 ; n°788-789 en 2024-2025.)
- [Courrier du Parc](https://www.pnr.corsica/fr/infos-telechargement) — Parc naturel régional de Corse · Gestion & ingénierie · accès libre (36 numéros repérés.)

### Outre-mer

- [Cahiers scientifiques du Parc amazonien de Guyane](https://www.parc-amazonien-guyane.fr/fr/publications-et-documents) — Parc amazonien de Guyane · Généraliste · accès libre · irrégulier (Environ 8 numéros ; n°8 en août 2025.)
- [Publications et documents](https://www.guadeloupe-parcnational.fr/fr/publications-et-documents) — Parc national de la Guadeloupe · Généraliste · accès libre · au fil de l'eau
- [Publications et documents](https://www.reunion-parcnational.fr/fr/publications-and-documents) — Parc national de La Réunion · Gestion & ingénierie · accès libre · annuel (rapport) (Restauration écologique et flore indigène.)
- [Newsletter RiZHOM](https://www.pole-tropical.org/actualites/newsletter/) — Pôle-relais zones humides tropicales · Zones humides · accès libre · plusieurs n°/an

## Sources à moissonner en priorité (écran « Sources »)

Le contexte (`GET`, voir `apps/affut/supabase/functions/affut-veille/README.md`)
renvoie un champ `sources_a_moissonner` : la liste que l'enseignant compile à
la main dans l'appli, onglet **Sources**. Chaque entrée porte `nom`,
`adresse` (URL d'une page ou d'un flux RSS), `type` (« flux RSS » ou « page
suivie »), `echelle`, `territoire`, `rubrique_defaut`.

Contrairement à la liste ci-dessus (point de départ pour une recherche
ouverte), celle-ci est une **consigne, pas une suggestion** : à chaque
exécution, visiter effectivement chacune de ces adresses (lire le flux RSS,
ou parcourir la page suivie) et regarder ce qui y est récent. Ne pas se
contenter d'une recherche web générale qui les ignorerait. Une source de
cette liste sans nouveauté publiable cette semaine n'est pas une erreur —
ne rien proposer plutôt que forcer un candidat faible.

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
