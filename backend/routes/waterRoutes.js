const express = require('express');
const router = express.Router();
const { getPrecipitation, getETData } = require('../controllers/waterController');

router.get('/precipitation', getPrecipitation);
router.post('/getETData', getETData);

module.exports = router;
