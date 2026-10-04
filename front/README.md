# Sadissa — Front

<<<<<<< HEAD
Projet front en JavaScript vanilla avec structure MVC légère : HTML, CSS et JS séparés par rôle.

## Structure actuelle
=======
Interface en JavaScript vanilla : HTML, CSS et JS séparés par rôle.

## Lancer le front
>>>>>>> origin/develop

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
<<<<<<< HEAD
├── index.html                          → Page d'accueil
├── pages/
│   ├── campagnes.html                  → Découvrir les campagnes
│   ├── comment-ca-marche.html          → Comment ça marche
│   ├── lancer-projet.html              → Lancer un projet
│   ├── creer-campagne.html             → Créer une campagne
│   └── dashboard.html                  → Dashboard
├── assets/
│   ├── css/
│   │   ├── base.css                    → variables + styles globaux
│   │   ├── layout.css                  → structure générale du site
│   │   └── pages/
│   │       ├── accueil.css
│   │       ├── campagnes.css
│   │       ├── comment-ca-marche.css
│   │       ├── creer-campagne.css
│   │       ├── dashboard.css
│   │       └── lancer-projet.css
│   ├── js/
│   │   ├── main.js                     → point d’entrée
│   │   ├── router.js                   → navigation / affichage
│   │   ├── api/
│   │   │   └── client.js               → client HTTP pour l’API
│   │   ├── components/
│   │   │   ├── header.js
│   │   │   ├── footer.js
│   │   │   └── campaign-card.js
│   │   ├── pages/
│   │   └── utils/
│   │       ├── dom.js
│   │       └── format.js
│   ├── img/
│   └── fonts/
└── README.md
```

=======
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

>>>>>>> origin/develop
## Règles de structure

| Couche | Rôle |
|--------|------|
| `index.html` + `pages/*.html` | structure de chaque écran |
<<<<<<< HEAD
| `assets/css/base.css` | variables globales et styles de base |
| `assets/css/layout.css` | layout général du site |
| `assets/css/pages/` | styles spécifiques à une page |
| `assets/js/pages/` | logique spécifique à une page |
| `assets/js/components/` | composants réutilisables |
| `assets/js/api/client.js` | appels HTTP vers le backend |
| `assets/js/utils/` | helpers utilitaires |

## Convention de développement

- 1 page = 1 HTML + 1 CSS + éventuellement 1 JS
- les styles globaux sont importés en premier
- les styles de page sont ajoutés ensuite
- la logique API ne doit pas être mélangée dans les composants
- les modules ES nécessitent un serveur HTTP

## API client

Le client API de base est prêt dans :

- `assets/js/api/client.js`

Il expose un objet `apiClient` avec des méthodes simples :

```js
import apiClient from './assets/js/api/client.js';

const campagnes = await apiClient.get('/campaigns');
const projet = await apiClient.post('/projects', { title: 'Mon projet' });
```

## Lancer le projet

Depuis le dossier `front` :

```bash
cd front
python3 -m http.server 8765
```

Puis ouvrir :

```text
http://127.0.0.1:8765
```

## À retenir

- le front est en vanilla JS
- chaque page est indépendante
- les styles globaux et les styles de page sont séparés
- le client API est centralisé dans `assets/js/api/client.js`
=======
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
>>>>>>> origin/develop
