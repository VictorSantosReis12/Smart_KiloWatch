const express = require('express');
const router = express.Router();
const metasController = require('../controllers/metasController');

router.post('/meta', metasController.criarMeta);
router.get('/meta', metasController.listarMetas);
router.get('/meta/selecionarPorId/:idMeta', metasController.selecionarMetaPorId);
router.get('/meta/listarPorUsuario/:idUsuario', metasController.listarMetasPorUsuario);
router.put('/meta/:idMeta', metasController.atualizarMeta);
router.put('/meta/setUsuario/:idMeta', metasController.setUsuarioMeta);
router.put('/meta/setEnergia/:idMeta', metasController.setEnergiaMeta);
router.put('/meta/setAgua/:idMeta', metasController.setAguaMeta);
router.put('/meta/setData/:idMeta', metasController.setDataMeta);
router.delete('/meta/:idMeta', metasController.deletarMeta);

module.exports = router;