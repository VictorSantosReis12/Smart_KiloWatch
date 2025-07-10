const express = require('express');
const router = express.Router();
const consumosAguaController = require('../controllers/consumosAguaController');
const { verifyToken } = require('../middlewares/AuthMiddleware');
const protegerRotas = require('../utils/protegerRotas');

router.post('/consumoAgua', consumosAguaController.criarConsumoAgua);
router.get('/consumoAgua', consumosAguaController.listarConsumosAgua);
router.get('/consumoAgua/selecionarPorId/:idConsumoAgua', consumosAguaController.selecionarConsumoAguaPorId);
router.get('/consumoAgua/listarPorAtividade/:idAtividade', consumosAguaController.listarConsumosAguaPorAtividade);
router.get('/consumoAgua/listarPorData', consumosAguaController.listarConsumosAguaPorData);
router.put('/consumoAgua/:idConsumoAgua', consumosAguaController.atualizarConsumoAgua);
router.put('/consumoAgua/setEletrodomestico/:idConsumoAgua', consumosAguaController.setAtividadeConsumoAgua);
router.put('/consumoAgua/setTempo/:idConsumoAgua', consumosAguaController.setTempoConsumoAgua);
router.put('/consumoAgua/setData/:idConsumoAgua', consumosAguaController.setDataConsumoAgua);
router.delete('/consumoAgua/:idConsumoAgua', consumosAguaController.deletarConsumoAgua);

protegerRotas(router, verifyToken);

module.exports = router;