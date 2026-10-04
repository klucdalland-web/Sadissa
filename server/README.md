<<<<<<< HEAD
# Sadissa — Backend API

Ce backend expose une API REST en Node.js / Express et utilise Prisma avec PostgreSQL pour gérer les données de la plateforme Sadissa.

## Stack technique

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT / cookies pour l’authentification
- structure MVC légère

## Structure actuelle

```bash
server/
├── app.js                          → Configuration Express + middlewares globaux
├── bin/
│   └── www                        → Point d’entrée du serveur
├── config/                        → Configuration globale du projet
├── controllers/                   → Logique métier des routes
│   ├── auth.controller.js
│   ├── campaignController.js
│   ├── type.piece.controller.js
│   └── user.controller.js
├── middlewares/
│   ├── apiKey.js
│   └── v1/
│       └── auth.validation.js
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
├── routes/
│   ├── index.js
│   ├── v1/
│   │   ├── index.js
│   │   ├── auth.route.js
│   │   ├── typepiece.route.js
│   │   └── users.route.js
│   └── v2/
├── utils/
│   ├── function.js
│   └── token.js
├── views/                         → Templates Jade de base
├── public/                        → Fichiers statiques
├── .env                           → Variables d’environnement
├── package.json
├── README.md
└── prisma7.config.ts
```

## Architecture

Le backend suit une logique MVC simplifiée :

- `routes/` : définition des endpoints HTTP
- `controllers/` : traitement métier et appels Prisma
- `middlewares/` : validation, sécurité, API key, auth
- `utils/` : fonctions utilitaires
- `prisma/schema.prisma` : schéma SQL / ORM

Flux principal :

`Request → Route → Middleware → Controller → Prisma → Réponse`

## API actuelle

Le serveur expose une base API sous le préfixe `/api` puis une version `/v1`.

Exemples de routes :

- `GET /api/v1/`
- `GET /api/v1/users`
- `GET /api/v1/users/type_user`
- `GET /api/v1/typepiece`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

## Authentification

Le backend gère :

- inscription
- connexion
- refresh de session
- logout
- récupération du profil connecté

La logique est centralisée dans :

- `controllers/auth.controller.js`
- `middlewares/v1/auth.validation.js`
- `utils/token.js`

## Validation et sécurité

Le projet utilise :

- validation des champs de formulaire dans les middlewares
- contrôle API key via `middlewares/apiKey.js`
- cookies HTTP pour stocker les tokens de session
- hachage des mots de passe avec BCrypt

## Base de données

Le schéma Prisma est dans :

- `prisma/schema.prisma`

Les migrations sont dans :

- `prisma/migrations/`

Pour appliquer ou recréer la base :

```bash
cd server
npx prisma migrate dev --name <nom_de_migration>
```

Ou pour repartir proprement en local :

```bash
cd server
npx prisma migrate reset
```

## Lancer le backend

Depuis le dossier `server` :

```bash
cd server
=======
# Sadissa

Sadissa est une plateforme de crowdfunding permettant aux porteurs de projets de créer des campagnes et aux contributeurs de les soutenir. La plateforme propose deux modèles de financement : le don libre et le financement avec récompenses.

## Structure du dépôt

```text
Sadissa/
├── front/      → Interface (HTML / CSS / JS vanilla)
├── server/     → API REST (Node.js / Express / Prisma)
└── README.md
```

## Démarrage rapide

Le serveur Express expose **à la fois** l’API et le front (même origine → cookies de session OK).

```bash
cd server
cp .env.example .env   # si besoin, puis renseigner les valeurs
>>>>>>> origin/develop
npm install
npm start
```

<<<<<<< HEAD
Le serveur démarre avec le script défini dans `package.json`.

## Variables d’environnement

Le projet attend une configuration `.env` avec notamment :

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=...
DIRECT_URL=...
API_KEY=...
```

## À retenir

Le backend n’est pas encore complètement finalisé, mais il suit bien une architecture API REST moderne avec :

- routes versionnées
- contrôleurs séparés
- Prisma pour la persistence
- middlewares pour validation/sécurité
- auth par session + cookies

C’est donc un backend fonctionnel en cours de construction, pas un simple squelette vide.
=======
Puis ouvrir :

```text
http://localhost:3000/
http://localhost:3000/pages/login.html
http://localhost:3000/pages/register.html
```

> **Important :** ne pas ouvrir le front via `file://`, Live Server ou un autre port. Les cookies d’auth ne fonctionnent correctement que sur `http://localhost:3000`.

## Authentification (résumé)

| Action | Endpoint | Effet UI |
|--------|----------|----------|
| Inscription | `POST /api/v1/auth/register` | Cookies de session + redirection |
| Connexion | `POST /api/v1/auth/login` | Cookies de session + redirection |
| Profil | `GET /api/v1/auth/me` | Header : « Bonjour » + **Se déconnecter** |
| Refresh | `POST /api/v1/auth/refresh` | Renouvelle automatiquement l’access token |
| Déconnexion | `POST /api/v1/auth/logout` | Header : **Se connecter** / **Créer un compte** |

Toutes les routes `/api/v1/*` exigent l’en-tête `x-api-key` (valeur = `API_KEY` du `.env`).

## Documentation détaillée

- Front : [`front/README.md`](front/README.md)
- Backend : [`server/README.md`](server/README.md)
>>>>>>> origin/develop
