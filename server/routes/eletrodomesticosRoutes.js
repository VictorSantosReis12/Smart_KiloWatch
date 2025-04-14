const express = require('express');
const router = express.Router();
const eletrodomesticosController = require('../controllers/eletrodomesticosController');

router.post('/eletrodomestico', eletrodomesticosController.criarEletrodomestico);
router.get('/eletrodomestico', eletrodomesticosController.listarEletrodomesticos);
router.get('/eletrodomestico/selecionarPorId/:idEletrodomestico', eletrodomesticosController.selecionarEletrodomesticoPorId);
router.get('/eletrodomestico/listarPorUsuario/:idUsuario', eletrodomesticosController.listarEletrodomesticosPorUsuario);
router.put('/eletrodomestico/:idEletrodomestico', eletrodomesticosController.atualizarEletrodomestico);
router.put('/eletrodomestico/setUsuario/:idEletrodomestico', eletrodomesticosController.setUsuarioEletrodomestico);
router.put('/eletrodomestico/setTipo/:idEletrodomestico', eletrodomesticosController.setTipoEletrodomestico);
router.put('/eletrodomestico/setMarca/:idEletrodomestico', eletrodomesticosController.setMarcaEletrodomestico);
router.put('/eletrodomestico/setModelo/:idEletrodomestico', eletrodomesticosController.setModeloEletrodomestico);
router.put('/eletrodomestico/setImagem/:idEletrodomestico', eletrodomesticosController.setImagemEletrodomestico);
router.put('/eletrodomestico/setConsumoMensal/:idEletrodomestico', eletrodomesticosController.setConsumoMensalEletrodomestico);
router.put('/eletrodomestico/setConsumoDiario/:idEletrodomestico', eletrodomesticosController.setConsumoDiarioEletrodomestico);
router.put('/eletrodomestico/setManterTempo/:idEletrodomestico', eletrodomesticosController.setManterTempoEletrodomestico);
router.delete('/eletrodomestico/:idEletrodomestico', eletrodomesticosController.deletarEletrodomestico);

module.exports = router;