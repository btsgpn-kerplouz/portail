-- Distinction mensuelle (bloc complet 1x/mois) vs tiers-mensuelle (rotation) --
-- ---------------------------------------------------------------------------
-- Depuis la fusion du 12/09/2026 (013-sources-suivies-periodicite.sql),
-- `periodicite = 'mensuelle'` signifiait en réalité « répartie en 3 groupes,
-- un tiers visité chaque samedi » (~1 visite toutes les 3 semaines) : la
-- vraie cadence mensuelle (tout le lot une fois par mois) avait été
-- abandonnée le même jour au profit de cette rotation, sans renommer la
-- valeur en base. Confusion relevée par l'utilisateur (18/09/2026) : l'écran
-- Sources n'offrait qu'une case « mensuelle », sans pouvoir choisir la vraie
-- cadence mensuelle pour une source qui en aurait besoin.
--
-- Cette migration :
-- - renomme les 137 lignes existantes `mensuelle` en `tiers-mensuelle`
--   (comportement réel inchangé : elles continuent de tourner par tiers,
--   voir `numeroSemaineIso()`/`groupeRotation()` dans
--   `functions/affut-veille/index.ts`) ;
-- - libère la valeur `mensuelle` pour son vrai sens : bloc complet, visité
--   une fois par mois (le premier samedi du mois) ;
-- - met à jour la contrainte pour accepter les 3 valeurs.

update affut_sources_suivies set periodicite = 'tiers-mensuelle' where periodicite = 'mensuelle';

alter table affut_sources_suivies
  drop constraint if exists affut_sources_suivies_periodicite_check;

alter table affut_sources_suivies
  add constraint affut_sources_suivies_periodicite_check
  check (periodicite in ('hebdomadaire', 'mensuelle', 'tiers-mensuelle'));
