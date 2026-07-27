-- ============================================================================
-- organisation-cours — « Bugs & améliorations » devient un espace commun
-- ============================================================================
-- Jusqu'ici `devNotes` vivait dans oc_blocs_perso (strictement privé, comme
-- `todoNotes`). Décision Martin (retour terrain multi-utilisateurs) : ce
-- module sert à signaler bugs/idées à toute l'équipe, il doit donc être
-- visible et modifiable par tous les comptes actifs — il rejoint
-- oc_blocs_partages (déjà utilisé pour weekTemplates, promotions...).
--
-- `todoNotes` (« À faire » personnel) N'EST PAS concerné : il reste dans
-- oc_blocs_perso, strictement privé par compte.
--
-- Reprend, s'il existe, le contenu personnel le plus récemment enregistré
-- (tous comptes confondus) comme valeur de départ de l'espace commun, plutôt
-- que de repartir à vide et perdre ce qui a déjà été noté.
-- ============================================================================

insert into oc_blocs_partages (cle, contenu)
select 'devNotes', contenu
from oc_blocs_perso
where cle = 'devNotes' and contenu is not null and contenu <> '""'::jsonb
order by updated_at desc
limit 1
on conflict (cle) do update set contenu = excluded.contenu;

delete from oc_blocs_perso where cle = 'devNotes';
