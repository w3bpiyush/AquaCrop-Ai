const express = require('express');
const router = express.Router();
const { getPrecipitation, getETData, getWaterRequirement } = require('../controllers/waterController');

router.get('/precipitation', getPrecipitation);
router.post('/getETData', getETData);
router.post('/getWaterRequirement', getWaterRequirement);

module.exports = router;
