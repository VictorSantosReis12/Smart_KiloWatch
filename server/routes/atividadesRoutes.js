const express = require('express');
const router = express.Router();
const atividadesController = require('../controllers/atividadesController');

router.post('/atividade', atividadesController.criarAtividade);
router.get('/atividade', atividadesController.listarAtividades);
router.get('/atividade/selecionarPorId/:idAtividade', atividadesController.selecionarAtividadePorId);
router.get('/atividade/listarPorUsuario/:idUsuario', atividadesController.listarAtividadesPorUsuario);
router.put('/atividade/:idAtividade', atividadesController.atualizarAtividade);
router.put('/atividade/setUsuario/:idAtividade', atividadesController.setUsuarioAtividade);
router.put('/atividade/setNome/:idAtividade', atividadesController.setNomeAtividade);
router.put('/atividade/setImagem/:idAtividade', atividadesController.setImagemAtividade);
router.put('/atividade/setLitrosMinuto/:idAtividade', atividadesController.setLitrosMinutoAtividade);
router.put('/atividade/setIsTempoUso/:idAtividade', atividadesController.setIsTempoUsoAtividade);
router.put('/atividade/setManterTempoUso/:idAtividade', atividadesController.setManterTempoUsoAtividade);
router.delete('/atividade/:idAtividade', atividadesController.deletarAtividade);

module.exports = router;