// Racine du site (dossier front/), calculée à partir de l'emplacement de ce fichier.
const ROOT = new URL('../../../', import.meta.url).pathname;

const COLUMNS = [
    {
        title: 'Navigation',
        links: [
            { label: 'Accueil', href: `${ROOT}index.html` },
            { label: 'Découvrir', href: `${ROOT}pages/campagnes.html` },
            { label: 'Comment ça marche', href: `${ROOT}pages/comment-ca-marche.html` },
            { label: 'Créer une campagne', href: `${ROOT}pages/creer-campagne.html` },
            { label: 'Se connecter', href: '#' },
        ],
    },
    {
        title: 'Catégories',
        links: [
            { label: 'Éducation', href: '#' },
            { label: 'Santé', href: '#' },
            { label: 'Environnement', href: '#' },
            { label: 'Économie locale', href: '#' },
            { label: 'Culture &amp; Art', href: '#' },
        ],
    },
    {
        title: 'Informations',
        links: [
            { label: 'À propos', href: '#' },
            { label: 'FAQ', href: '#' },
            { label: 'Conditions d\'utilisation', href: '#' },
            { label: 'Politique de confidentialité', href: '#' },
            { label: 'Nous contacter', href: '#' },
        ],
    },
];

const SOCIALS = [
    {
        label: 'Facebook',
        icon: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />',
    },
    {
        label: 'X',
        icon: '<path d="M4 4l16 16M20 4L4 20" />',
    },
    {
        label: 'Instagram',
        icon: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />',
    },
    {
        label: 'LinkedIn',
        icon: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />',
    },
    {
        label: 'YouTube',
        icon: '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />',
    },
];

function buildColumns() {
    return COLUMNS.map(({ title, links }) => `
        <div class="site-footer__column">
            <h2 class="site-footer__title">${title}</h2>
            <ul class="site-footer__list">
                ${links.map(({ label, href }) => `<li><a href="${href}">${label}</a></li>`).join('')}
            </ul>
        </div>`).join('');
}

function buildSocials() {
    return SOCIALS.map(({ label, icon }) => `
        <li>
            <a href="#" aria-label="${label}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>
            </a>
        </li>`).join('');
}

export function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';

    footer.innerHTML = `
        <div class="container">
            <div class="site-footer__grid">
                <div class="site-footer__brand">
                    <a class="site-footer__logo" href="${ROOT}index.html" aria-label="Sadissa, retour à l'accueil">
                        <img class="site-footer__logo-img" src="${ROOT}assets/img/logo.png" alt="Sadissa" />
                    </a>
                    <p class="site-footer__tagline">
                        Ensemble, soutenons les projets qui font bouger notre société.
                    </p>
                    <ul class="site-footer__social">${buildSocials()}</ul>
                </div>

                ${buildColumns()}

                <div class="site-footer__newsletter">
                    <h2 class="site-footer__title">Restez informé</h2>
                    <p class="site-footer__text">
                        Recevez les dernières campagnes directement dans votre boîte mail.
                    </p>
                    <form class="site-footer__form" novalidate>
                        <label class="sr-only" for="footer-email">Votre adresse e-mail</label>
                        <input class="site-footer__input" id="footer-email" type="email"
                               name="email" placeholder="Votre adresse e-mail" autocomplete="email" required />
                        <button class="site-footer__submit" type="submit" aria-label="S'abonner">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>

            <div class="site-footer__bottom">
                <p>© ${new Date().getFullYear()} Sadissa. Tous droits réservés.</p>
                <p>Une initiative pour un Congo plus solidaire <span class="site-footer__heart" aria-hidden="true">♥</span></p>
            </div>
        </div>`;

    // Pas encore d'API pour la newsletter : on empêche seulement le rechargement de la page.
    footer.querySelector('.site-footer__form').addEventListener('submit', (event) => {
        event.preventDefault();
    });

    return footer;
}