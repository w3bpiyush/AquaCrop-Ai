const express = require('express');
const router = express.Router();
const { getPrecipitation } = require('../controllers/waterController');

router.get('/precipitation', getPrecipitation);

module.exports = router;
