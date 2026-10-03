# Sadissa — Backend API

API REST en Node.js / Express, Prisma et PostgreSQL. Le serveur sert aussi les fichiers du dossier `front/` pour que le site et l’API partagent la même origine.

## Stack

- Node.js / Express
- Prisma + PostgreSQL
- JWT + cookies httpOnly (session)
- CORS (credentials)
- API key (`x-api-key`)

## Lancer le serveur

```bash
cd server
npm install
npm start
```

Par défaut : `http://localhost:3000`

| URL | Contenu |
|-----|---------|
| `http://localhost:3000/` | Front (pages HTML) |
| `http://localhost:3000/api/v1/` | API versionnée |

Le front est monté via `express.static('../front')` dans `app.js`.

## Variables d’environnement

Fichier `server/.env` (voir `.env.example`) :

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=...
DIRECT_URL=...
API_KEY=sadissa-v1-secret-key
JWT_SECRET=...
```

Toutes les routes `/api/v1/*` exigent l’en-tête :

```http
x-api-key: <API_KEY>
```

## Authentification

Cookies posés au login / register :

| Cookie | Durée | Rôle |
|--------|-------|------|
| `access_token` | 15 min | Accès aux routes protégées |
| `refresh_token` | 30 jours | Renouvellement de session (`path=/api/v1/auth`) |

### Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| `POST` | `/api/v1/auth/register` | API key | Inscription + cookies |
| `POST` | `/api/v1/auth/login` | API key | Connexion + cookies |
| `POST` | `/api/v1/auth/refresh` | cookie `refresh_token` | Nouveau couple de tokens |
| `POST` | `/api/v1/auth/logout` | cookie `refresh_token` | Révoque la session |
| `GET` | `/api/v1/auth/me` | cookie `access_token` | Profil connecté |

### Corps attendus

**Register**

```json
{
  "email": "user@exemple.com",
  "password": "motdepasse",
  "password_confirmation": "motdepasse",
  "firstname": "Ada",
  "lastname": "Lovelace",
  "type_piece_id": 1,
  "number_piece": "A1234567"
}
```

**Login**

```json
{
  "email": "user@exemple.com",
  "password": "motdepasse",
  "password_confirmation": "motdepasse"
}
```

> Le front envoie `password_confirmation` égal au mot de passe à la connexion (requis par la validation actuelle).

### Autres routes v1

- `GET /api/v1/`
- `GET /api/v1/users`
- `GET /api/v1/users/type_user`
- `GET /api/v1/typepiece`
- `GET /api/v1/campaigns` — liste statique de campagnes (données mock)

## Structure

```text
server/
├── app.js                 → Express, CORS, static front, /api
├── bin/www                → démarrage
├── config/
├── controllers/
│   └── auth.controller.js
├── middlewares/
│   ├── apiKey.js          → ignore OPTIONS ; vérifie x-api-key
│   └── v1/
│       ├── auth.middleware.js
│       └── auth.validation.js
├── prisma/
├── routes/v1/
│   └── auth.route.js
└── utils/token.js         → JWT + cookies
```

Flux : `Request → CORS → Route → Middleware → Controller → Prisma → Réponse`

## Base de données

```bash
cd server
npx prisma migrate dev --name <nom>
# ou
npx prisma migrate reset
npx prisma db seed
```

## Sécurité

- validation des champs (register / login)
- API key obligatoire sur `/api/v1`
- mots de passe hashés (bcrypt)
- tokens en cookies httpOnly (`sameSite: lax`)
- refresh token rotation (ancien token révoqué à chaque refresh)
- CORS avec `credentials: true` pour le front
