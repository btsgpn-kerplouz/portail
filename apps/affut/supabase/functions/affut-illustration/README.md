# Edge Function `affut-illustration`

Récupère l'image « og:image » d'une page source (Lot 14) pour illustrer une
entrée — voir le détail en tête d'`index.ts` et l'entrée « Lot 14 » dans
`apps/affut/AVANCEMENT.md`. Appelée directement depuis le navigateur du
rédacteur (bouton « Récupérer l'illustration », `apps/affut/index.html`),
pas depuis une routine cloud — à la différence d'`affut-veille`.

## Déploiement

Sans CLI Supabase installée localement : dashboard Supabase du projet
`portail` → **Edge Functions** → **Deploy a new function** → nom
`affut-illustration` → coller le contenu de `index.ts` → Deploy.

Avec la CLI (si disponible) :

```
supabase functions deploy affut-illustration --project-ref uoeuzxstotqnembcpofx
```

Pas de `--no-verify-jwt` ici (contrairement à `affut-veille`) :
l'authentification passe par la session Supabase Auth normale du
rédacteur connecté — la plateforme rejette déjà tout appel sans jeton
valide avant d'atteindre `index.ts`, qui vérifie en plus que l'appelant
est un rédacteur actif (`affut_redacteurs.actif`).

## Secret à poser

Aucun. `SUPABASE_URL` et `SUPABASE_ANON_KEY` sont fournis automatiquement
par la plateforme à toute Edge Function — rien à poser manuellement.

## Appel depuis le front

```
POST https://uoeuzxstotqnembcpofx.supabase.co/functions/v1/affut-illustration
     -H "authorization: Bearer <jeton de session du rédacteur>"
     -H "content-type: application/json"
     -d '{"url": "https://exemple.fr/un-article"}'
     → { "image_url": "https://exemple.fr/images/photo.jpg" }  (ou image_url: null si aucune trouvée)
```

Côté front, `client().functions.invoke("affut-illustration", { body: { url } })`
attache automatiquement le jeton de la session en cours.
