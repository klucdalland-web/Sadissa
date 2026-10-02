# Sadissa — Front

Architecture vanilla JS à respecter. Les fichiers sont vides : chaque développeur implémente dans les emplacements prévus.

## Arborescence

```
front/
├── index.html                          → Accueil
├── pages/
│   ├── campagnes.html                  → Découvrir les campagnes
│   ├── comment-ca-marche.html          → Comment ça marche
│   ├── lancer-projet.html              → Lancer un projet
│   ├── creer-campagne.html             → Créer une campagne
│   └── dashboard.html                  → Dashboard
└── assets/
    ├── css/
    │   ├── variables.css               → Variables globales
    │   ├── base.css                    → Reset / styles de base
    │   ├── layout.css                  → Header, nav, footer, grille
    │   └── pages/                      → 1 CSS par page
    ├── js/
    │   ├── main.js                     → Point d’entrée
    │   ├── router.js                   → Navigation
    │   ├── api/
    │   │   └── client.js               → Appels API
    │   ├── components/                 → Blocs réutilisables
    │   │   ├── header.js
    │   │   ├── footer.js
    │   │   └── campaign-card.js
    │   ├── pages/                      → 1 JS par page
    │   └── utils/                      → Helpers (dom, format…)
    ├── img/
    └── fonts/
```

## Convention

| Couche | Rôle |
|--------|------|
| `pages/*.html` + `index.html` | Structure HTML de chaque écran |
| `assets/css/pages/` | Styles spécifiques à une page |
| `assets/js/pages/` | Logique spécifique à une page |
| `assets/js/components/` | Composants partagés |
| `assets/js/api/` | Communication avec le serveur |
| `assets/css/variables.css` / `base.css` / `layout.css` | Styles globaux |

**Règle :** 1 page = 1 HTML + 1 CSS + 1 JS. Ne pas mélanger la logique d’une page dans une autre.

## Pages

1. **Accueil** — `index.html`
2. **Découvrir les campagnes** — `pages/campagnes.html`
3. **Comment ça marche** — `pages/comment-ca-marche.html`
4. **Lancer un projet** — `pages/lancer-projet.html`
5. **Créer une campagne** — `pages/creer-campagne.html`
6. **Dashboard** — `pages/dashboard.html`

## Lancer en local

Les modules ES nécessitent un serveur HTTP (pas `file://`) :

```bash
cd front
python3 -m http.server 8765
```

Ouvrir http://127.0.0.1:8765
