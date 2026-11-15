-- ============================================================================
-- affut — Mémoire de la veille, étape 5 : candidats non retenus, nouveaux
-- motifs, rubriques resserrées, sources à bon rendement (15/11/2026)
-- ============================================================================
-- Suite du bilan éditorial du 15/11/2026
-- (documents/affut_bilan_editorial_2026-11-15.md, à la racine du dépôt) :
-- 82 candidats sur 251 étaient restés dans la moisson au moment de publier,
-- sans jamais être écartés. Ils étaient invisibles pour la veille, qui se
-- croyait retenue à 80 % au lieu de 46 %.
--
-- 1. Motifs : trois codes en plus.
--    - `acces_difficile` : source en anglais, payante, ou page qui ne fait
--      que renvoyer vers une autre ;
--    - `institutionnel`  : vie institutionnelle (anniversaire, convention,
--      partenariat, trophée, départ en retraite) ;
--    - `non_retenu`      : candidat laissé dans la moisson à la publication
--      du numéro. Jamais choisi à la main : posé par l'app au moment de
--      publier (index.html) et par le rattrapage ci-dessous. Compté à part
--      par la veille (pas un motif, juste « pas pris »).
-- 2. Rattrapage : les candidats encore dans la moisson des numéros DÉJÀ
--    publiés deviennent des lignes `non_retenu`, datées du jour de
--    publication du numéro, puis la moisson de ces numéros est vidée.
-- 3. Rubriques : « Protocoles » fusionnée dans « Science & protocoles ».
-- 4. Sources : pages d'actualités à bon rendement ajoutées, dans la
--    rotation par tiers comme toutes les autres (`tiers-mensuelle`, aucune
--    source hebdomadaire — décision de l'enseignant), trois doublons
--    d'adresse exacte supprimés.
--
-- Vocabulaire des motifs répété dans index.html (MOTIFS_ECART),
-- functions/affut-veille/index.ts et documents/brief-veille.md.
-- À appliquer AVANT de déployer le front et la fonction Edge. Idempotent.
-- ============================================================================

-- ---- 1. motifs -------------------------------------------------------------
alter table affut_candidats_ecartes drop constraint if exists affut_candidats_ecartes_motif_code_check;
alter table affut_candidats_ecartes add constraint affut_candidats_ecartes_motif_code_check
  check (motif_code is null or motif_code in (
    'trop_court', 'pas_de_donnees', 'hors_sujet', 'agenda', 'trop_local', 'redondant',
    'acces_difficile', 'institutionnel', 'autre', 'non_retenu'
  ));

-- ---- 2. rattrapage des moissons des numéros publiés -----------------------
insert into affut_candidats_ecartes
  (numero_id, candidat_id, rubrique, source, url, titre, motif, motif_code, format, ecarte_le)
select
  n.numero,
  c->>'id',
  coalesce(c->>'rubrique', ''),
  coalesce(c->'source', '{}'::jsonb),
  coalesce(c->>'url', ''),
  coalesce(c->>'titre', ''),
  null,
  'non_retenu',
  case when c->>'format' in (
    'rapport_etude', 'article_fond', 'publication_scientifique', 'breve',
    'texte_officiel', 'agenda', 'tribune', 'donnees_outil', 'multimedia', 'autre'
  ) then c->>'format' end,
  coalesce(n.date_publication::timestamptz, n.cree_le)
from affut_numeros n
cross join lateral jsonb_array_elements(
  case when jsonb_typeof(n.moisson) = 'array' then n.moisson else '[]'::jsonb end
) as c
where n.statut = 'publie'
  and c->>'id' is not null
  and not exists (
    select 1 from affut_candidats_ecartes x where x.candidat_id = c->>'id'
  );

update affut_numeros
set moisson = '[]'::jsonb
where statut = 'publie'
  and jsonb_typeof(moisson) = 'array'
  and jsonb_array_length(moisson) > 0;

-- ---- 3. rubriques ----------------------------------------------------------
update affut_entrees set rubrique = 'Science & protocoles' where rubrique = 'Protocoles';
update affut_candidats_ecartes set rubrique = 'Science & protocoles' where rubrique = 'Protocoles';
update affut_sources_suivies set rubrique_defaut = 'Science & protocoles' where rubrique_defaut = 'Protocoles';

-- ---- 4. sources ------------------------------------------------------------
-- Adresses vérifiées le 15/11/2026 (page d'actualités datées, chargée sans
-- connexion). Réserves naturelles de France écartée : certificat HTTPS
-- invalide sur www.reserves-naturelles.org ce jour-là.
insert into affut_sources_suivies (id, nom, adresse, type, echelle, territoire, rubrique_defaut, periodicite)
values
  ('actu-pnr-armorique', 'Parc naturel régional d''Armorique — actualités', 'https://www.pnr-armorique.fr/actualites', 'page suivie', 'régional', 'Bretagne', 'Gestion', 'tiers-mensuelle'),
  ('actu-bretagne-vivante', 'Bretagne Vivante — actualités', 'https://www.bretagne-vivante.org/actualites/', 'page suivie', 'régional', 'Bretagne', 'Suivis espèces', 'tiers-mensuelle'),
  ('actu-cbn-brest', 'Conservatoire botanique national de Brest — actualités', 'https://www.cbnbrest.fr/toutes-les-actus', 'page suivie', 'régional', 'Bretagne', 'Etat de conservation', 'tiers-mensuelle'),
  ('actu-abb', 'Agence bretonne de la biodiversité — nouvelles', 'https://biodiversite.bzh/nouvelles/', 'page suivie', 'régional', 'Bretagne', 'Données & référentiels', 'tiers-mensuelle'),
  ('actu-snpn', 'SNPN — actualités', 'https://www.snpn.com/actualites/', 'page suivie', 'national', '', 'Positionnement politique', 'tiers-mensuelle'),
  ('actu-centre-ressources-eee', 'Centre de ressources Espèces exotiques envahissantes — actualités', 'https://especes-exotiques-envahissantes.fr/actualites/', 'page suivie', 'national', '', 'Espèces exotiques envahissantes', 'tiers-mensuelle'),
  ('actu-pn-cevennes', 'Parc national des Cévennes — actualités', 'https://www.cevennes-parcnational.fr/actualites', 'page suivie', 'régional', 'Occitanie', 'Suivis espèces', 'tiers-mensuelle')
on conflict (id) do nothing;

-- Doublons d'adresse exacte (relevés dès le bilan du 26/09/2026) : on garde
-- la ligne du catalogue (`revue-…`), on retire la copie saisie à la main.
delete from affut_sources_suivies
where id in ('s1788463207156', 's1788463049988', 's1788464492574')
  and exists (
    select 1 from affut_sources_suivies g
    where g.id like 'revue-%' and g.adresse = affut_sources_suivies.adresse
  );
