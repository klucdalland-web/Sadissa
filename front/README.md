# Sadissa — Front

Projet front en JavaScript vanilla avec structure MVC légère : HTML, CSS et JS séparés par rôle.

## Structure actuelle

```
front/
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

## Règles de structure

| Couche | Rôle |
|--------|------|
| `index.html` + `pages/*.html` | structure de chaque écran |
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
