var express = require('express');
var router = express.Router();
var campaignController = require('../../controllers/campaign.controller');

router.get('/', campaignController.getCampaigns);

module.exports = router;
