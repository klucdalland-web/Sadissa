/**
 * Sérialise une campagne Prisma vers le format API front.
 */
function toCampaignDto(campaign, contributionCount = 0) {
    if (!campaign) return null;

    return {
        id: campaign.id,
        createdAt: campaign.createdAt,
        title: campaign.title,
        category: campaign.category,
        type: campaign.type,
        image: campaign.image,
        raised: campaign.raised,
        goal: campaign.goal,
        daysLeft: campaign.daysLeft,
        contributionCount,
        href: `/pages/campagne-detail.html?id=${campaign.id}`,
    };
}

module.exports = { toCampaignDto };
