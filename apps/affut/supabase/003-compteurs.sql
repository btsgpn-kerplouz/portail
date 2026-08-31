-- ============================================================================
-- affut — compteurs de fréquentation (idée notée le 29/08/2026, instruite ici
-- avec le Lot 6, à la demande du 30/08/2026)
-- ============================================================================
-- Un compteur de vues n'a de sens qu'avec un stockage centralisé partagé
-- entre navigateurs (voir mémoire Claude Code affut-bilan-vues-redaction) —
-- désormais possible grâce aux tables posées dans 001-schema.sql.
--
-- Ni `anon` ni `authenticated` n'ont accès en écriture directe à
-- affut_numeros/affut_entrees (voir 002-policies.sql) : les compteurs
-- s'incrémentent uniquement via ces 2 fonctions RPC, étroites par
-- construction — elles ne permettent RIEN d'autre qu'incrémenter le
-- compteur d'une ligne déjà publique (numéro publié / entrée validée),
-- jamais de lire ou modifier autre chose. `language plpgsql` (jamais `sql`,
-- voir 002-policies.sql pour le pourquoi).
-- ============================================================================

create or replace function affut_incrementer_vue_numero(p_numero integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update affut_numeros
  set vues = vues + 1
  where numero = p_numero and statut = 'publie';
end;
$$;

create or replace function affut_incrementer_clic_source(p_entree_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update affut_entrees
  set clics_source = clics_source + 1
  where id = p_entree_id and valide = true;
end;
$$;

grant execute on function affut_incrementer_vue_numero(integer) to anon, authenticated;
grant execute on function affut_incrementer_clic_source(text) to anon, authenticated;

-- Pas de protection anti-abus (une même personne peut rafraîchir en boucle
-- et gonfler un compteur) : accepté sciemment — outil pédagogique interne à
-- faible enjeu, pas un compteur public affiché ou monétisé. À revoir si un
-- jour ces chiffres servent à autre chose qu'un repère approximatif pour
-- l'enseignant.
