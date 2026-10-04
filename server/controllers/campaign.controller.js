const { res } = require("../utils/function");
const { CAMPAIGNS } = require("../data/campaigns");

function getCampaigns(req, resp) {
    return res(resp, 200, "Liste des campagnes récupérée avec succès", CAMPAIGNS);
}

module.exports = { getCampaigns };
