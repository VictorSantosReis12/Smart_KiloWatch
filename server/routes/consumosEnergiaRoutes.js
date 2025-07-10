const express = require('express');
const router = express.Router();
const consumosEnergiaController = require('../controllers/consumosEnergiaController');
const { verifyToken } = require('../middlewares/AuthMiddleware');
const protegerRotas = require('../utils/protegerRotas');

router.post('/consumoEnergia', consumosEnergiaController.criarConsumoEnergia);
router.get('/consumoEnergia', consumosEnergiaController.listarConsumosEnergia);
router.get('/consumoEnergia/selecionarPorId/:idConsumoEnergia', consumosEnergiaController.selecionarConsumoEnergiaPorId);
router.get('/consumoEnergia/listarPorEletrodomestico/:idEletrodomestico', consumosEnergiaController.listarConsumosEnergiaPorEletrodomestico);
router.get('/consumoEnergia/listarPorData', consumosEnergiaController.listarConsumosEnergiaPorData);
router.put('/consumoEnergia/:idConsumoEnergia', consumosEnergiaController.atualizarConsumoEnergia);
router.put('/consumoEnergia/setEletrodomestico/:idConsumoEnergia', consumosEnergiaController.setEletrodomesticoConsumoEnergia);
router.put('/consumoEnergia/setTempo/:idConsumoEnergia', consumosEnergiaController.setTempoConsumoEnergia);
router.put('/consumoEnergia/setData/:idConsumoEnergia', consumosEnergiaController.setDataConsumoEnergia);
router.delete('/consumoEnergia/:idConsumoEnergia', consumosEnergiaController.deletarConsumoEnergia);

protegerRotas(router, verifyToken);

module.exports = router;