-- Mémoire de la veille, étape 2 : format des actualités + motif d'écart en un clic
-- ---------------------------------------------------------------------------
-- Objectif (26/09/2026) : que la veille apprenne des FORMATS d'actualité qui
-- plaisent (rapport avec données, article de fond…) plutôt que de favoriser
-- certaines sources — beaucoup de très bonnes sources publient des contenus
-- trop courts ou résumés, écartés un à un sans que rien ne s'en souvienne.
--
-- - `format`     : type de contenu du candidat/de l'entrée, attribué par
--                  l'agent de veille à partir d'un vocabulaire FERMÉ (sinon
--                  les statistiques par format n'ont pas de sens) ;
-- - `motif_code` : raison de l'écart choisie en un clic par l'enseignant, en
--                  plus du motif libre déjà existant (`motif`).
--
-- Colonnes facultatives : les lignes existantes restent valides (NULL =
-- « non classé »). Le vocabulaire est répété à 4 endroits, à garder
-- synchronisés : cette migration, `index.html` (FORMATS / MOTIFS_ECART),
-- `functions/affut-veille/index.ts` (FORMATS_AUTORISES) et
-- `documents/brief-veille.md`.
--
-- À appliquer AVANT de déployer le front et la fonction Edge de cette étape
-- (SQL Editor de Supabase). Idempotent : peut être rejoué sans risque.

alter table affut_entrees
  add column if not exists format text;

alter table affut_candidats_ecartes
  add column if not exists format text,
  add column if not exists motif_code text;

alter table affut_entrees drop constraint if exists affut_entrees_format_check;
alter table affut_entrees add constraint affut_entrees_format_check
  check (format is null or format in (
    'rapport_etude', 'article_fond', 'publication_scientifique', 'breve',
    'texte_officiel', 'agenda', 'tribune', 'donnees_outil', 'multimedia', 'autre'
  ));

alter table affut_candidats_ecartes drop constraint if exists affut_candidats_ecartes_format_check;
alter table affut_candidats_ecartes add constraint affut_candidats_ecartes_format_check
  check (format is null or format in (
    'rapport_etude', 'article_fond', 'publication_scientifique', 'breve',
    'texte_officiel', 'agenda', 'tribune', 'donnees_outil', 'multimedia', 'autre'
  ));

alter table affut_candidats_ecartes drop constraint if exists affut_candidats_ecartes_motif_code_check;
alter table affut_candidats_ecartes add constraint affut_candidats_ecartes_motif_code_check
  check (motif_code is null or motif_code in (
    'trop_court', 'pas_de_donnees', 'hors_sujet', 'agenda', 'trop_local', 'redondant', 'autre'
  ));

comment on column affut_entrees.format is
  'Type de contenu attribué par la veille (vocabulaire fermé, voir la contrainte) ; NULL = non classé. Jamais exposé publiquement : absent de affut_entrees_public.';
comment on column affut_candidats_ecartes.format is
  'Format du candidat au moment de l''écart (même vocabulaire que affut_entrees.format).';
comment on column affut_candidats_ecartes.motif_code is
  'Raison de l''écart choisie en un clic (vocabulaire fermé) ; complète le motif libre `motif`. Alimente les statistiques par motif, jamais par source.';
