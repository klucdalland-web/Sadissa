# Sadissa — Front

Interface en JavaScript vanilla : HTML, CSS et JS séparés par rôle.

## Lancer le front

Le front est servi **par le backend** (même origine que l’API) :

```bash
cd server
npm start
```

Ouvrir :

```text
http://localhost:3000/
```

Ne pas utiliser `python -m http.server`, Live Server ou `file://` : les cookies de session (`access_token`, `refresh_token`) ne seraient pas envoyés correctement à l’API.

## Structure actuelle

```text
front/
├── index.html
├── pages/
│   ├── login.html
│   ├── register.html
│   ├── campagnes.html
│   ├── campagne-detail.html
│   ├── comment-ca-marche.html
│   ├── lancer-projet.html
│   ├── creer-campagne.html
│   └── dashboard.html
├── assets/
│   ├── css/
│   │   ├── base.css
│   │   ├── layout.css
│   │   └── pages/
│   │       ├── accueil.css
│   │       ├── auth.css
│   │       └── …
│   ├── js/
│   │   ├── main.js                 → header + footer
│   │   ├── api/
│   │   │   ├── client.js           → HTTP + refresh auto sur 401
│   │   │   └── auth.js             → getCurrentUser / logout
│   │   ├── components/
│   │   │   ├── header.js           → UI connecté / déconnecté
│   │   │   ├── footer.js
│   │   │   └── campaign-card.js
│   │   └── pages/
│   │       ├── login.js
│   │       ├── register.js
│   │       └── auth-form.js
│   └── img/
└── README.md
```

## Authentification côté front

### Détecter si l’utilisateur est connecté

```js
import { getCurrentUser, isAuthenticated, logout } from './api/auth.js';

const user = await getCurrentUser();
if (user) {
  // connecté → user.firstName, user.email, …
} else {
  // déconnecté
}
```

`getCurrentUser()` appelle `GET /api/v1/auth/me`. Les tokens sont dans des cookies **httpOnly** : le JS ne les lit pas directement.

### Header

| État | Affichage |
|------|-----------|
| Déconnecté | **Se connecter** + **Créer un compte** |
| Connecté | **Bonjour, Prénom** + **Se déconnecter** |

Les pages `login` / `register` redirigent vers l’accueil si l’utilisateur est déjà connecté.

### Client API

- Base URL : `http://localhost:3000/api` (ou la même origine si le site tourne déjà sur le port 3000)
- Envoie automatiquement `x-api-key` et `credentials: 'include'`
- Sur un `401`, tente un `POST /v1/auth/refresh` puis réessaie la requête une fois

```js
import apiClient from './api/client.js';

await apiClient.post('v1/auth/login', {
  email,
  password,
  password_confirmation: password,
});

const me = await apiClient.me();
await apiClient.logout();
```

## Règles de structure

| Couche | Rôle |
|--------|------|
| `index.html` + `pages/*.html` | structure de chaque écran |
| `assets/css/base.css` | variables et styles de base |
| `assets/css/layout.css` | layout général (header, footer, boutons) |
| `assets/css/pages/` | styles spécifiques à une page |
| `assets/js/pages/` | logique d’une page |
| `assets/js/components/` | composants réutilisables |
| `assets/js/api/` | client HTTP et session |

## Convention

- 1 page = 1 HTML + 1 CSS + éventuellement 1 JS
- styles globaux d’abord, styles de page ensuite
- la logique API reste dans `assets/js/api/`
- les modules ES nécessitent un serveur HTTP (`localhost:3000`)
