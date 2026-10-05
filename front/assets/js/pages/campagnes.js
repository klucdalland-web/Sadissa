import { createCampaignCard } from '../components/campaign-card.js';
import { getCampagnes } from '../api/campagnes.js';
import { renderListState } from '../utils/dom.js';

async function renderCampagnes() {
    const grid = document.getElementById('campaigns-grid');
    const count = document.getElementById('campaigns-count');
    if (!grid) return;

    if (count) count.textContent = '';

    renderListState(grid, {
        type: 'loading',
        message: 'Chargement des campagnes…',
    });

    try {
        const campaigns = await getCampagnes({ sort: 'createdAt:desc' });

        if (!campaigns.length) {
            renderListState(grid, {
                type: 'empty',
                message: 'Aucune campagne n’est disponible pour le moment.',
            });
            return;
        }

        if (count) {
            count.textContent =
                campaigns.length === 1
                    ? '1 campagne en cours'
                    : `${campaigns.length} campagnes en cours`;
        }

        grid.replaceChildren(...campaigns.map(createCampaignCard));
    } catch (error) {
        console.error(error);
        renderListState(grid, {
            type: 'error',
            message: 'Impossible de charger les campagnes. Vérifiez votre connexion puis réessayez.',
            onRetry: renderCampagnes,
        });
    }
}

renderCampagnes();
