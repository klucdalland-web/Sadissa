import { createCampaignCard } from '../components/campaign-card.js';
import { getCampagnesRecentes } from '../api/campagnes.js';
import { renderListState } from '../utils/dom.js';

async function renderFeaturedCampaigns() {
    const grid = document.getElementById('campaigns-grid');
    if (!grid) return;

    renderListState(grid, {
        type: 'loading',
        message: 'Chargement des campagnes…',
    });

    try {
        const campaigns = await getCampagnesRecentes(4);

        if (!campaigns.length) {
            renderListState(grid, {
                type: 'empty',
                message: 'Aucune campagne à découvrir pour le moment.',
            });
            return;
        }

        grid.replaceChildren(...campaigns.map(createCampaignCard));
    } catch (error) {
        console.error(error);
        renderListState(grid, {
            type: 'error',
            message: 'Impossible de charger les campagnes. Vérifiez votre connexion puis réessayez.',
            onRetry: renderFeaturedCampaigns,
        });
    }
}

renderFeaturedCampaigns();
