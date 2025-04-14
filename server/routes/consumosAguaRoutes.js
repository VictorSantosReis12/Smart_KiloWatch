const express = require('express');
const router = express.Router();
const consumosAguaController = require('../controllers/consumosAguaController');

router.post('/consumoAgua', consumosAguaController.criarConsumoEnergia);
router.get('/consumoAgua', consumosAguaController.listarConsumosEnergia);
router.get('/consumoAgua/selecionarPorId/:idConsumoAgua', consumosAguaController.selecionarConsumoAguaPorId);
router.get('/consumoAgua/listarPorAtividade/:idAtividade', consumosAguaController.listarConsumosAguaPorAtividade);
router.get('/consumoAgua/listarPorData', consumosAguaController.listarConsumosAguaPorData);
router.put('/consumoAgua/:idConsumoAgua', consumosAguaController.atualizarConsumoAgua);
router.put('/consumoAgua/setEletrodomestico/:idConsumoAgua', consumosAguaController.setEletrodomesticoConsumoAgua);
router.put('/consumoAgua/setTempo/:idConsumoAgua', consumosAguaController.setTempoConsumoAgua);
router.put('/consumoAgua/setData/:idConsumoAgua', consumosAguaController.setDataConsumoAgua);
router.delete('/consumoAgua/:idConsumoAgua', consumosAguaController.deletarConsumoAgua);

module.exports = router;