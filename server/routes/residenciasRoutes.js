const express = require('express');
const router = express.Router();
const residenciasController = require('../controllers/residenciasController');

router.post('/residencia', residenciasController.criarResidencia);
router.get('/residencia', residenciasController.listarResidencias);
router.get('/residencia/selecionarPorId/:idResidencia', residenciasController.selecionarResidenciaPorId);
router.get('/residencia/listarPorUsuario/:idUsuario', residenciasController.listarResidenciasPorUsuario);
router.put('/residencia/:idResidencia', residenciasController.atualizarResidencia);
router.put('/residencia/setUsuario/:idResidencia', residenciasController.setUsuarioResidencia);
router.put('/residencia/setEstado/:idResidencia', residenciasController.setEstadoResidencia);
router.put('/residencia/setCidade/:idResidencia', residenciasController.setCidadeResidencia);
router.put('/residencia/setRua/:idResidencia', residenciasController.setRuaResidencia);
router.put('/residencia/setNumero/:idResidencia', residenciasController.setNumeroResidencia);
router.put('/residencia/setComplemento/:idResidencia', residenciasController.setComplementoResidencia);
router.delete('/residencia/:idResidencia', residenciasController.deletarResidencia);

module.exports = router;