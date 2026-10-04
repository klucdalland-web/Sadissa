import { createCampaignCard } from '../components/campaign-card.js';

// Données fictives en attendant l'API.
// Pour ajouter une image : image: 'assets/img/campagnes/nom-du-fichier.jpg'
const FEATURED_CAMPAIGNS = [
    {
        id: 1,
        title: 'Soutien pour l\'école primaire de Mfilou',
        category: 'Éducation',
        type: 'don',
        image: 'assets/img/ecole-mfilou.jfif',
        raised: 235000,
        goal: 500000,
        daysLeft: 15,
    },
    {
        id: 2,
        title: 'Mon atelier, mon avenir',
        category: 'Économie locale',
        type: 'recompenses',
        image: 'assets/img/atelier-couture.jfif',
        raised: 120000,
        goal: 300000,
        daysLeft: 12,
    },
    {
        id: 3,
        title: 'Protection des gorilles de la Loango',
        category: 'Environnement',
        type: 'don',
        image: 'assets/img/gorilles-loango.jfif',
        raised: 680000,
        goal: 1000000,
        daysLeft: 21,
    },
    {
        id: 4,
        title: 'Un dispensaire pour tous',
        category: 'Santé',
        type: 'recompenses',
        image: 'assets/img/dispensaire.jfif',
        raised: 450000,
        goal: 800000,
        daysLeft: 18,
    },
];

function renderFeaturedCampaigns() {
    const grid = document.getElementById('campaigns-grid');
    if (!grid) return;

    grid.replaceChildren(...FEATURED_CAMPAIGNS.map(createCampaignCard));
}

renderFeaturedCampaigns();