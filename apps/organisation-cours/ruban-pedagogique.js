/*
 * ruban-pedagogique.js — Ruban pédagogique du BTS GPN (Kerplouz LaSalle).
 * Répartition par semestre : UE → capacités et disciplines (référentiel officiel).
 * Colonnes « enseignants »/« évaluateurs » VOLONTAIREMENT VIDES dans ce dépôt public :
 * ces affectations nominatives vivent uniquement dans Supabase (oc_blocs_partages,
 * clé "rubanUeCaps" — voir js/sync.js), jamais en dur dans un fichier de code publiable.
 * Exposé via window.RUBAN_PEDAGOGIQUE.
 * NB : les capacités C4.x à C8.x renvoient vers le référentiel interactif (modules M4–M8).
 */
(function () {
  const S = (id, label, resume, ues) => ({ id, label, resume, ues });
  const U = (code, title, resume, capacites) => ({ code, title, resume, capacites });
  const C = (code, title, disciplines, enseignants, evaluateurs) => ({ code, title, disciplines, enseignants, evaluateurs });

  window.RUBAN_PEDAGOGIQUE = {
    diplome: "BTS Gestion et Protection de la Nature",
    etablissement: "Kerplouz LaSalle — Auray",
    note: "Prévisionnel de semestrialisation.",
    pdf: { ruban: "ruban-semestres.pdf" },
    semestres: [
      S("s1", "Semestre 1", "Inventaires, concertation, enjeux socio-économiques", [
        U("UE1.1", "Inventaires naturalistes", "Élaborer une stratégie de mise en œuvre de protocoles", [
          C("C4.1", "Élaborer une stratégie de mise en œuvre de protocoles",
            ["BE", "STAE", "TIM", "STA", "Maths"], [], [])
        ]),
        U("UE1.2", "Concertation territoriale", "Élaborer un diagnostic territorial et participer à une concertation", [
          C("C8.1", "Réaliser un diagnostic territorial",
            ["ESC", "Hist-géo", "SESG", "STAE"], [], []),
          C("C8.2", "Participer à un processus de concertation",
            ["ESC", "Hist-géo", "STAE"], [], [])
        ]),
        U("UE1.3", "Enjeux socio-économiques", "Étudier une question sociétale et argumenter", [
          C("C1.1", "Saisir les enjeux de la réalité socio-économique",
            ["SESG"], [], []),
          C("C1.2", "Se situer dans des questions sociétales",
            ["SESG", "Français", "ESC"], [], []),
          C("C1.3", "Argumenter un point de vue dans un débat de société",
            ["Français", "ESC"], [], [])
        ])
      ]),
      S("s2", "Semestre 2", "Diagnostic écologique, animation nature", [
        U("UE2.1", "Diagnostic écologique", "Recueillir des données écologiques et produire un diagnostic de synthèse", [
          C("C4.2", "Recueillir des données écologiques à partir d’un protocole sur une base cartographique géoréférencée",
            ["TIM", "STAE", "BE", "STA"], [], []),
          C("C4.3", "Produire un diagnostic de synthèse",
            ["STAE", "BE", "TIM", "STA", "Maths"], [], []),
          C("C5.1", "Choisir des stratégies opérationnelles en fonction du contexte",
            ["STAE", "STA"], [], [])
        ]),
        U("UE2.2", "Animation nature", "Concevoir et mettre en œuvre des animations nature pour des publics variés", [
          C("C6.2", "Réaliser des prestations d’animation scientifique",
            ["ESC", "BE", "STAE", "TIM"], [], []),
          C("C6.3", "Coordonner l’accueil du public en sécurité",
            ["ESC"], [], [])
        ])
      ]),
      S("s3", "Semestre 3", "Génie écologique, médiation scientifique", [
        U("UE3.1", "Génie écologique", "Organiser et coordonner un chantier de génie écologique", [
          C("C5.2", "Organiser des actions de gestion de la nature",
            ["STAE", "SESG"], [], []),
          C("C5.3", "Coordonner la mise en œuvre des opérations de génie écologique",
            ["STAE", "STE"], [], []),
          C("C7.1", "Monter un projet professionnel",
            ["SESG", "Maths", "STAE"], [], [])
        ]),
        U("UE3.2", "Médiation scientifique", "Produire et utiliser des ressources pour vulgariser des concepts scientifiques", [
          C("C3.1", "Répondre à des besoins d’information pour soi et pour un public",
            ["Documentation"], [], []),
          C("C3.3", "Communiquer avec des moyens adaptés",
            ["Documentation"], [], []),
          C("C6.1", "Concevoir des projets de médiation scientifique dans le cadre d’activités EREDD",
            ["ESC", "BE"], [], [])
        ])
      ]),
      S("s4", "Semestre 4", "Communication, valorisation, multisports, insertion professionnelle", [
        U("UE4.1", "Communication", "Communiquer sur un sujet sensible en situation de conflit", [
          C("C8.3", "Communiquer sur un projet sensible en situation de conflit",
            ["ESC", "Hist-géo", "STAE"], [], [])
        ]),
        U("UE4.2", "Valorisation des espaces naturels", "Conduire et évaluer un projet en réponse à une commande professionnelle", [
          C("C2.4", "Conduire un projet",
            ["ESC"], [], []),
          C("C7.2", "Opérationnaliser les différentes phases d’un projet professionnel",
            ["STAE"], [], []),
          C("C7.3", "Évaluer globalement le déroulement d’un projet professionnel",
            ["STAE", "SESG"], [], [])
        ]),
        U("UE4.3", "Multisports", "Pratique d’une activité sportive", [
          C("C2.1", "S’engager dans un mode de vie actif et solidaire",
            ["EPS"], [], [])
        ]),
        U("UE4.4", "Insertion professionnelle", "S’intégrer au monde professionnel et s’ouvrir à l’international", [
          C("C2.2", "S’insérer dans un environnement professionnel",
            ["APPP"], [], []),
          C("C2.3", "S’adapter à des enjeux ou des contextes particuliers",
            ["EIL"], [], []),
          C("C3.2", "Communiquer en langue étrangère",
            ["Anglais"], [], [])
        ])
      ])
    ]
  };
})();
