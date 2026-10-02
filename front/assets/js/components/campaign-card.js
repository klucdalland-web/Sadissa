import { formatFCFA, formatDaysLeft } from '../utils/format.js';

const TYPES = {
    don: 'Don',
    recompenses: 'Récompenses',
};

/**
 * Crée une carte de campagne.
 * campaign : { title, category, type ('don' | 'recompenses'), image, raised, goal, daysLeft, href }
 */
export function createCampaignCard(campaign) {
    const {
        title,
        category,
        type = 'don',
        image = null,
        raised = 0,
        goal = 0,
        daysLeft = 0,
        href = '#',
    } = campaign;

    const safeType = type in TYPES ? type : 'don';
    const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

    const card = document.createElement('article');
    card.className = `campaign-card campaign-card--${safeType}`;

    // Le HTML est une structure vide : les textes sont insérés avec textContent,
    // ce qui reste sûr même quand les données viendront de l'API.
    card.innerHTML = `
        <div class="campaign-card__media">
            <img class="campaign-card__image" loading="lazy" alt="" />
            <span class="campaign-card__badge"></span>
        </div>
        <div class="campaign-card__body">
            <div>
                <h3 class="campaign-card__title"></h3>
                <p class="campaign-card__category"></p>
            </div>
            <div class="campaign-card__funding">
                <div class="campaign-card__figures">
                    <p class="campaign-card__amounts"><strong class="js-raised"></strong> / <span class="js-goal"></span></p>
                    <p class="campaign-card__percent"></p>
                </div>
                <div class="campaign-card__progress" role="progressbar"
                     aria-valuemin="0" aria-valuemax="100">
                    <div class="campaign-card__progress-fill"></div>
                </div>
            </div>
            <p class="campaign-card__days">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span class="js-days"></span>
            </p>
            <a class="btn btn--primary campaign-card__cta">
                Voir le projet
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                </svg>
            </a>
        </div>`;

    // Image (cadre de couleur si aucune image n'est fournie)
    const img = card.querySelector('.campaign-card__image');
    if (image) {
        img.src = image;
        img.alt = title;
    } else {
        img.remove();
    }

    card.querySelector('.campaign-card__badge').textContent = TYPES[safeType];
    card.querySelector('.campaign-card__title').textContent = title;
    card.querySelector('.campaign-card__category').textContent = category;
    card.querySelector('.js-raised').textContent = formatFCFA(raised);
    card.querySelector('.js-goal').textContent = formatFCFA(goal);
    card.querySelector('.campaign-card__percent').textContent = `${percent}%`;
    card.querySelector('.js-days').textContent = formatDaysLeft(daysLeft);
    card.querySelector('.campaign-card__cta').href = href;

    const progress = card.querySelector('.campaign-card__progress');
    progress.setAttribute('aria-valuenow', String(percent));
    progress.setAttribute('aria-label', `${percent}% de l'objectif atteint`);
    card.querySelector('.campaign-card__progress-fill').style.width = `${percent}%`;

    return card;
}