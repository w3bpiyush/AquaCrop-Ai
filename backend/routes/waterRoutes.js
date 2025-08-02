const express = require('express');
const router = express.Router();
const { getIrrigationPlan } = require('../controllers/waterController');

router.post('/getIrrigationPlan', getIrrigationPlan);

module.exports = router;
