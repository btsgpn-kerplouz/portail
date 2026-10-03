-- Mémoire de la veille, étape 4 : synthèse HEBDOMADAIRE des précisions d'écart
-- ---------------------------------------------------------------------------
-- Demande de l'enseignant (03/10/2026) : les précisions écrites à la main en
-- écartant un candidat (colonne `motif` de affut_candidats_ecartes) n'étaient
-- relues que pour les 15 derniers écarts, puis oubliées. Désormais, chaque
-- samedi avant la moisson, la routine reçoit TOUTES les précisions écrites
-- depuis sa dernière synthèse, en tire au plus 3 propositions de règle, et
-- les dépose en attente (affut_propositions_regles, inchangé) : elles
-- n'entrent dans les règles en vigueur que si l'enseignant les accepte.
--
-- Cette table ne sert qu'à mémoriser JUSQU'OÙ la routine a lu : une ligne par
-- synthèse faite (même sans proposition). La fonction Edge `affut-veille`
-- l'écrit avec sa clé serveur ; la routine n'a jamais d'accès direct.
--
-- Même protection que les autres tables de la mémoire : rédacteur actif =
-- lecture/écriture, anon = rien. À appliquer AVANT de redéployer la fonction
-- Edge (sans elle, la fonction relit toutes les précisions à chaque fois et
-- n'enregistre pas les synthèses). Idempotent.

create table if not exists affut_syntheses_motifs (
  id bigint generated always as identity primary key,
  -- Date d'écart de la précision la plus récente prise en compte : la
  -- synthèse suivante repart des précisions écrites APRÈS ce moment.
  lu_jusqu_au timestamptz not null,
  nb_precisions int not null default 0 check (nb_precisions >= 0),
  nb_propositions int not null default 0 check (nb_propositions between 0 and 3),
  faite_le timestamptz not null default now()
);

comment on table affut_syntheses_motifs is
  'Synthèses hebdomadaires des précisions d''écart par la routine de veille (étape 4 de la mémoire) : jusqu''où elle a lu. Jamais publique.';

alter table affut_syntheses_motifs enable row level security;

drop policy if exists affut_syntheses_motifs_redaction on affut_syntheses_motifs;
create policy affut_syntheses_motifs_redaction on affut_syntheses_motifs
  for all
  to authenticated
  using (affut_is_active_redacteur())
  with check (affut_is_active_redacteur());
