# Sadissa — Backend (MVC)

Architecture Express MVC classique. Les fichiers métier sont vides : chaque développeur implémente dans les emplacements prévus.

## Arborescence
###. npx prisma migrate dev --name init         
```
server/
├── app.js                          → Config Express + montage des routes
├── bin/www                         → Démarrage du serveur
├── models/                         → Accès données / schéma
│   └── campaign.js                 → Modèle exemple (à dupliquer)
├── controllers/                    → Logique métier
│   └── campaignController.js       → Contrôleur exemple (à dupliquer)
├── routes/                         → Définition des endpoints
│   ├── index.js
│   ├── users.js
│   └── campaigns.js                → Route modèle (à dupliquer)
├── views/                          → Templates (Jade)
├── middlewares/                    → Middlewares partagés
└── public/                         → Fichiers statiques
```

## Convention MVC

| Couche | Rôle | Exemple |
|--------|------|---------|
| `routes/` | URL → appelle le contrôleur | `routes/campaigns.js` |
| `controllers/` | Logique, orchestre le modèle | `controllers/campaignController.js` |
| `models/` | Données / persistance | `models/campaign.js` |
| `views/` | Rendu HTML (si besoin) | `views/` |
| `middlewares/` | Auth, validation, etc. | `middlewares/` |

**Flux :** `Request → Route → Controller → Model → Controller → Response`

## Route modèle

`campaigns` est le trio de référence. Pour une nouvelle ressource, dupliquer ces 3 fichiers :

1. `routes/<ressource>.js`
2. `controllers/<ressource>Controller.js`
3. `models/<ressource>.js`

Puis monter la route dans `app.js` :

```js
var campaignsRouter = require('./routes/campaigns');
app.use('/campaigns', campaignsRouter);
```

## Alignement avec le front

| Front | Backend (ressource typique) |
|-------|-----------------------------|
| Accueil | `index` |
| Découvrir / Créer campagne | `campaigns` |
| Dashboard | `campaigns` + `users` |
| Lancer un projet | à définir (ex. `projects`) |

## Lancer

```bash
cd server
npm start
```
