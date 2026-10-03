/**
 * Données statiques de campagnes (en attendant la BDD).
 * Format aligné avec les cartes du front.
 */
const CAMPAIGNS = [
    {
        id: 1,
        title: "Soutien pour l'école primaire de Mfilou",
        category: "Éducation",
        type: "don",
        image: "/assets/img/ecole-mfilou.jfif",
        raised: 235000,
        goal: 500000,
        daysLeft: 15,
        href: "/pages/campagne-detail.html?id=1",
    },
    {
        id: 2,
        title: "Mon atelier, mon avenir",
        category: "Économie locale",
        type: "recompenses",
        image: "/assets/img/atelier-couture.jfif",
        raised: 120000,
        goal: 300000,
        daysLeft: 12,
        href: "/pages/campagne-detail.html?id=2",
    },
    {
        id: 3,
        title: "Protection des gorilles de la Loango",
        category: "Environnement",
        type: "don",
        image: "/assets/img/gorilles-loango.jfif",
        raised: 680000,
        goal: 1000000,
        daysLeft: 21,
        href: "/pages/campagne-detail.html?id=3",
    },
    {
        id: 4,
        title: "Un dispensaire pour tous",
        category: "Santé",
        type: "recompenses",
        image: "/assets/img/dispensaire.jfif",
        raised: 450000,
        goal: 800000,
        daysLeft: 18,
        href: "/pages/campagne-detail.html?id=4",
    },
];

module.exports = { CAMPAIGNS };
