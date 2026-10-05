var express = require('express');
var router = express.Router();
var campaignController = require('../../controllers/campaign.controller');

router.get('/', campaignController.getCampaigns);
router.post('/:id/contributions', campaignController.createContribution);
router.get('/:id', campaignController.getCampaignById);

module.exports = router;
