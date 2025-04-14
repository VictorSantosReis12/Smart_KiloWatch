const express = require('express');
const router = express.Router();
const tarifasController = require('../controllers/tarifasController');

router.post('/tarifa', tarifasController.criarTarifa);
router.get('/tarifa', tarifasController.listarTarifas);
router.get('/tarifa/selecionarPorId/:idTarifa', tarifasController.selecionarTarifaPorId);
router.get('/tarifa/selecionarPorEstado', tarifasController.selecionarTarifaPorEstado);
router.put('/tarifa/:idTarifa', tarifasController.atualizarTarifa);
router.put('/tarifa/setEstado/:idTarifa', tarifasController.setEstadoTarifa);
router.put('/tarifa/setEnergia/:idTarifa', tarifasController.setEnergiaTarifa);
router.put('/tarifa/setAgua/:idTarifa', tarifasController.setAguaTarifa);
router.delete('/tarifa/:idTarifa', tarifasController.deletarTarifa);

module.exports = router;