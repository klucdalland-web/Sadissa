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
npm install
npm start
```

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
