-- ============================================================================
-- organisation-cours — table d'alias d'initiales (étape 5 du plan multi-utilisateurs)
-- ============================================================================
-- Le champ legacy `teacher` est une chaîne libre d'initiales ("TZ, MD"),
-- résolue côté client (js/enseignants.js + js/sync.js) vers des comptes réels
-- via les tables de jointure oc_ue_enseignants / oc_sequence_enseignants /
-- oc_session_enseignants (déjà créées par schema.sql).
--
-- Cas courant (le jeton legacy est déjà les initiales telles que construites
-- à l'inscription, ex. "MD" pour Martin Diraison) : résolu par simple égalité
-- avec oc_enseignants.initiales, aucune table supplémentaire nécessaire.
--
-- Cette table couvre le cas résiduel : un jeton legacy qui NE correspond PAS
-- aux initiales telles qu'auto-générées à l'inscription (homonymie, jeton
-- historique différent...). Un enseignant peut déclarer "je suis aussi
-- désigné par ce jeton" — auto-déclaratif, comme le reste du profil.
-- ============================================================================

create table if not exists oc_alias_initiales (
  alias         text primary key,
  enseignant_id uuid not null references oc_enseignants (user_id) on delete cascade,
  constraint oc_alias_initiales_maj check (alias = upper(alias))
);

alter table oc_alias_initiales enable row level security;

-- Lecture ouverte aux enseignants actifs : nécessaire pour résoudre les
-- jetons legacy de tout le monde, pas seulement les siens.
create policy oc_alias_initiales_select on oc_alias_initiales
  for select
  to authenticated
  using (oc_is_active_teacher());

-- Auto-déclaratif : un compte ne peut créer/retirer qu'un alias pointant vers
-- lui-même (pas d'usurpation du jeton d'un collègue).
create policy oc_alias_initiales_insert on oc_alias_initiales
  for insert
  to authenticated
  with check (oc_is_active_teacher() and enseignant_id = auth.uid());

create policy oc_alias_initiales_delete on oc_alias_initiales
  for delete
  to authenticated
  using (oc_is_active_teacher() and enseignant_id = auth.uid());
