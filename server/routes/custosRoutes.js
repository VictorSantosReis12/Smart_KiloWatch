const express = require('express');
const router = express.Router();
const custosController = require('../controllers/custosController');
const { verifyToken } = require('../middlewares/AuthMiddleware');
const protegerRotas = require('../utils/protegerRotas');

router.post('/custo', custosController.criarCusto);
router.get('/custo', custosController.listarCustos);
router.get('/custo/selecionarPorId/:idCusto', custosController.selecionarCustoPorId);
router.get('/custo/listarPorUsuario/:idUsuario', custosController.listarCustosPorUsuario);
router.get('/custo/selecionarPorData', custosController.selecionarCustoPorData);
router.put('/custo/:idCusto', custosController.atualizarCusto);
router.put('/custo/setUsuario/:idCusto', custosController.setUsuarioCusto);
router.put('/custo/setEnergiaSemImposto/:idCusto', custosController.setEnergiaSemImpostoCusto);
router.put('/custo/setEnergiaComImposto/:idCusto', custosController.setEnergiaComImpostoCusto);
router.put('/custo/setAguaSemImposto/:idCusto', custosController.setAguaSemImpostoCusto);
router.put('/custo/setAguaComImposto/:idCusto', custosController.setAguaComImpostoCusto);
router.put('/custo/setData/:idCusto', custosController.setDataCusto);
router.delete('/custo/:idCusto', custosController.deletarCusto);

protegerRotas(router, verifyToken);

module.exports = router;