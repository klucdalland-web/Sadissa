import { createCampaignCard } from '../components/campaign-card.js';
import { getCampagnes } from '../api/campagnes.js';
import { renderListState } from '../utils/dom.js';

let allCampaigns = [];
let currentFilter = 'all';
let searchTerm = '';

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
        allCampaigns = await getCampagnes({ sort: 'createdAt:desc' });

        if (!allCampaigns.length) {
            renderListState(grid, {
                type: 'empty',
                message: "Aucune campagne n'est disponible pour le moment.",
            });
            return;
        }

        applyFilter();
    } catch (error) {
        console.error(error);
        renderListState(grid, {
            type: 'error',
            message: 'Impossible de charger les campagnes. Vérifiez votre connexion puis réessayez.',
            onRetry: renderCampagnes,
        });
    }
}

function applyFilter() {
    const grid = document.getElementById('campaigns-grid');
    const count = document.getElementById('campaigns-count');
    if (!grid) return;

    let filteredCampaigns = allCampaigns;

    // Filter by category
    if (currentFilter !== 'all') {
        filteredCampaigns = filteredCampaigns.filter(campaign => campaign.category === currentFilter);
    }

    // Filter by search term
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredCampaigns = filteredCampaigns.filter(campaign => {
            return Object.values(campaign).some(value =>
                value && String(value).toLowerCase().includes(term)
            );
        });
    }

    if (!filteredCampaigns.length) {
        renderListState(grid, {
            type: 'empty',
            message: 'Aucune campagne ne correspond à votre recherche.',
        });
        if (count) count.textContent = '0 campagne';
        return;
    }

    if (count) {
        count.textContent =
            filteredCampaigns.length === 1
                ? '1 campagne en cours'
                : `${filteredCampaigns.length} campagnes en cours`;
    }

    grid.replaceChildren(...filteredCampaigns.map(createCampaignCard));
}

function setupFilters() {
    const filtersBar = document.getElementById('filters-bar');
    if (!filtersBar) return;

    const filterButtons = filtersBar.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            applyFilter();
        });
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value;
            applyFilter();
        });
    }
}

renderCampagnes();
setupFilters();
