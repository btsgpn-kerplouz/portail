-- ============================================================================
-- affut — réparation ponctuelle : chiffres mal découpés hérités des bugs
-- corrigés au Lot 10/10ter (voir apps/affut/AVANCEMENT.md)
-- ============================================================================
-- Deux bugs successifs sur le même chemin (bouton « Retenir » d'un candidat
-- de moisson) :
--   1. Avant le Lot 10 : entree.chiffres recevait cand.chiffres (tableau de
--      CHAÎNES brutes, format "valeur | libellé" — voir
--      documents/brief-veille.md) tel quel, sans conversion. flatChiffres()
--      lit .v/.l sur ces objets attendus {v,l} : sur une chaîne brute, .v et
--      .l valent undefined → affichage "undefined · undefined · ...".
--   2. Premier correctif (Lot 10, insuffisant) : chaque chaîne convertie en
--      {v: "", l: <chaîne entière>} SANS la découper sur le "|" — le
--      "valeur | libellé" attendu se retrouvait donc affiché tel quel dans
--      le libellé (ex. "108 | ours détectés a minima…"), une ligne bien
--      plus longue que prévu qui déborde de l'écran une fois affichée.
-- Ce script répare les DEUX cas en une seule passe, en réutilisant la même
-- convention que parseChiffreLigne() côté front (découpe sur le premier
-- "|", "*" final = accent) :
--   - élément encore de type "string" (bug 1, jamais retouché) ;
--   - élément déjà {v:"", l:"..."} mais dont l contient encore un "|"
--     (bug 2, corrigé une première fois de travers).
-- Idempotent : un élément déjà bien découpé (v non vide, ou l sans "|") ne
-- matche plus le WHERE, donc relancer ce script ne fait rien de plus.
-- ============================================================================

create or replace function affut_reparer_chiffre_legacy(brut text)
returns jsonb
language plpgsql
as $$
declare
  pos int;
  v_part text;
  l_part text;
  accent boolean := false;
begin
  pos := position('|' in brut);
  if pos = 0 then
    return jsonb_build_object('v', '', 'l', trim(brut));
  end if;
  v_part := trim(substring(brut from 1 for pos - 1));
  l_part := trim(substring(brut from pos + 1));
  if l_part ~ '\*$' then
    accent := true;
    l_part := trim(regexp_replace(l_part, '\*$', ''));
  end if;
  if accent then
    return jsonb_build_object('v', v_part, 'l', l_part, 'accent', true);
  else
    return jsonb_build_object('v', v_part, 'l', l_part);
  end if;
end;
$$;

update affut_entrees
set chiffres = (
  select jsonb_agg(
    case
      when jsonb_typeof(elem) = 'string'
        then affut_reparer_chiffre_legacy(elem #>> '{}')
      when jsonb_typeof(elem) = 'object'
           and coalesce(elem->>'v', '') = ''
           and (elem->>'l') like '%|%'
        then affut_reparer_chiffre_legacy(elem->>'l')
      else elem
    end
  )
  from jsonb_array_elements(chiffres) as elem
)
where exists (
  select 1 from jsonb_array_elements(chiffres) as elem2
  where jsonb_typeof(elem2) = 'string'
     or (jsonb_typeof(elem2) = 'object'
         and coalesce(elem2->>'v', '') = ''
         and (elem2->>'l') like '%|%')
);

drop function affut_reparer_chiffre_legacy(text);
