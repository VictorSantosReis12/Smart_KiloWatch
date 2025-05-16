const express = require('express');
const router = express.Router();
const nodemailerController = require('../controllers/nodemailerController');

router.post('/suporte', nodemailerController.enviarEmail);

module.exports = router;