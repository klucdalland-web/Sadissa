import { getCurrentUser, logout as logoutSession } from '../api/auth.js';

// Racine du site (dossier front/), calculée à partir de l'emplacement de ce fichier.
// Les liens fonctionnent ainsi depuis index.html comme depuis pages/*.html.
const ROOT = new URL('../../../', import.meta.url).pathname;

const NAV_LINKS = [
    { label: 'Découvrir', href: 'pages/campagnes.html' },
    { label: 'Comment ça marche', href: 'pages/comment-ca-marche.html' },
    { label: 'Créer une campagne', href: 'pages/creer-campagne.html' },
];

function normalizePath(path) {
    return path.endsWith('/') ? `${path}index.html` : path;
}

function buildLinks() {
    const currentPath = normalizePath(window.location.pathname);

    return NAV_LINKS.map(({ label, href }) => {
        const isActive = currentPath === `${ROOT}${href}`;

        return `
            <li>
                <a class="site-header__link${isActive ? ' is-active' : ''}"
                   href="${ROOT}${href}"${isActive ? ' aria-current="page"' : ''}>${label}</a>
            </li>`;
    }).join('');
}

function guestActionsHtml() {
    return `
        <a class="btn btn--outline" href="${ROOT}pages/login.html">Se connecter</a>
        <a class="btn btn--primary" href="${ROOT}pages/register.html">Créer un compte</a>`;
}

function userActionsHtml(user) {
    const firstName = user.firstName || user.email || 'Mon compte';

    return `
        <span class="site-header__user" title="${user.email || ''}">
            Bonjour, <strong>${firstName}</strong>
        </span>
        <button class="btn btn--outline" type="button" data-auth-logout>Se déconnecter</button>`;
}

function initMenu(header) {
    const toggle = header.querySelector('.site-header__toggle');
    const menu = header.querySelector('.site-header__menu');

    function setOpen(open) {
        header.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    }

    toggle.addEventListener('click', () => {
        setOpen(!header.classList.contains('is-open'));
    });

    menu.addEventListener('click', (event) => {
        if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setOpen(false);
    });

    window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
        if (event.matches) setOpen(false);
    });
}

function renderAuthActions(header, user) {
    const actions = header.querySelector('[data-auth-actions]');
    if (!actions) return;

    actions.innerHTML = user ? userActionsHtml(user) : guestActionsHtml();
}

async function initAuth(header) {
    const user = await getCurrentUser();
    renderAuthActions(header, user);

    header.addEventListener('click', async (event) => {
        const logoutBtn = event.target.closest('[data-auth-logout]');
        if (!logoutBtn) return;

        logoutBtn.disabled = true;
        logoutBtn.textContent = 'Déconnexion…';

        await logoutSession();
        renderAuthActions(header, null);
        window.location.href = `${ROOT}index.html`;
    });
}

export function createHeader() {
    const header = document.createElement('header');
    header.className = 'site-header';

    header.innerHTML = `
        <div class="container site-header__inner">
            <a class="site-header__logo" href="${ROOT}index.html" aria-label="Sadissa, retour à l'accueil">
                <img class="site-header__logo-img" src="${ROOT}assets/img/logo.png" alt="Sadissa" />
            </a>

            <button class="site-header__toggle" type="button"
                    aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="site-menu">
                <span class="site-header__bar"></span>
                <span class="site-header__bar"></span>
                <span class="site-header__bar"></span>
            </button>

            <div class="site-header__menu" id="site-menu">
                <nav aria-label="Navigation principale">
                    <ul class="site-header__links">${buildLinks()}</ul>
                </nav>

                <div class="site-header__actions">
                    <button class="site-header__search" type="button" aria-label="Rechercher">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2" stroke-linecap="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="7" />
                            <path d="M20 20l-3.5-3.5" />
                        </svg>
                    </button>
                    <div class="site-header__auth" data-auth-actions>
                        ${guestActionsHtml()}
                    </div>
                </div>
            </div>
        </div>`;

    initMenu(header);
    initAuth(header);
    return header;
}
