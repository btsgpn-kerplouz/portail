-- ============================================================================
-- organisation-cours — détacher (pas détruire) les séquences d'une UE supprimée
-- ============================================================================
-- Corrige une contradiction relevée avant le portage du front : app.js
-- (bouton "Supprimer" d'une UE) promet à l'utilisateur que "les séquences et
-- séances associées seront conservées mais détachées". Mais schema.sql
-- déclarait `oc_sequences.ue_id ... on delete cascade` : supprimer une UE
-- aurait au contraire détruit ses séquences — y compris celles d'un collègue
-- co-enseignant. Cette migration aligne le schéma sur le comportement promis.
--
-- oc_sessions référence déjà oc_ues en "on delete set null" (schema.sql) —
-- seule oc_sequences était en cascade.
-- ============================================================================

alter table oc_sequences drop constraint if exists oc_sequences_ue_id_fkey;

alter table oc_sequences
  add constraint oc_sequences_ue_id_fkey
  foreign key (ue_id) references oc_ues (id) on delete set null;
