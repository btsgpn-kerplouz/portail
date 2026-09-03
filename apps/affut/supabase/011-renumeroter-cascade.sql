-- ============================================================================
-- affut — autorise la renumérotation d'un numéro (Lot 23, 03/09/2026)
-- ============================================================================
-- Demandé par l'utilisateur après un brouillon de test créé par erreur
-- (n°1, vide) alors qu'un vrai numéro valide portait déjà le n°2 : pouvoir
-- supprimer le brouillon puis renuméroter le n°2 en n°1.
--
-- La suppression d'un numéro fonctionnait déjà (affut_entrees.numero_id
-- est en `on delete cascade` depuis 001-schema.sql). La renumérotation, en
-- revanche, est un simple `update affut_numeros set numero = ... where
-- numero = ...` côté front (voir renommerNumeroDistant() dans index.html)
-- — mais Postgres refuse par défaut de changer une clé primaire référencée
-- par une clé étrangère tant que les lignes qui la référencent existent.
-- Cette migration ajoute `on update cascade` aux 3 FK qui pointent vers
-- affut_numeros(numero), pour que Postgres répercute lui-même le
-- changement en une seule transaction implicite — pas de bricolage
-- multi-requêtes côté client, qui risquerait un état intermédiaire
-- incohérent en cas d'échec réseau à mi-chemin.
--
-- Recherche du nom de contrainte à la volée (plutôt que de supposer le nom
-- par défaut <table>_<colonne>_fkey) : plus robuste si une contrainte a un
-- jour été renommée à la main.
-- ============================================================================

do $$
declare
  nom_contrainte text;
begin
  select conname into nom_contrainte
  from pg_constraint
  where conrelid = 'affut_entrees'::regclass
    and confrelid = 'affut_numeros'::regclass
    and contype = 'f';
  execute format('alter table affut_entrees drop constraint %I', nom_contrainte);
  execute 'alter table affut_entrees add constraint affut_entrees_numero_id_fkey
    foreign key (numero_id) references affut_numeros(numero)
    on delete cascade on update cascade';

  select conname into nom_contrainte
  from pg_constraint
  where conrelid = 'affut_ingestion_log'::regclass
    and confrelid = 'affut_numeros'::regclass
    and contype = 'f';
  execute format('alter table affut_ingestion_log drop constraint %I', nom_contrainte);
  execute 'alter table affut_ingestion_log add constraint affut_ingestion_log_numero_id_fkey
    foreign key (numero_id) references affut_numeros(numero)
    on delete set null on update cascade';

  select conname into nom_contrainte
  from pg_constraint
  where conrelid = 'affut_candidats_ecartes'::regclass
    and confrelid = 'affut_numeros'::regclass
    and contype = 'f';
  execute format('alter table affut_candidats_ecartes drop constraint %I', nom_contrainte);
  execute 'alter table affut_candidats_ecartes add constraint affut_candidats_ecartes_numero_id_fkey
    foreign key (numero_id) references affut_numeros(numero)
    on delete set null on update cascade';
end $$;
