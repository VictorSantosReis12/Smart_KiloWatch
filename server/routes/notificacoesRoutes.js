const express = require('express');
const router = express.Router();
const notificacoesController = require('../controllers/notificacoesController');

router.post('/notificacao', notificacoesController.criarNotificacao);
router.get('/notificacao', notificacoesController.listarNotificacoes);
router.get('/notificacao/selecionarPorId/:idNotificacao', notificacoesController.selecionarNotificacaoPorId);
router.get('/notificacao/listarPorUsuario/:idUsuario', notificacoesController.listarNotificacoesPorUsuario);
router.put('/notificacao/:idNotificacao', notificacoesController.atualizarNotificacao);
router.put('/notificacao/setUsuario/:idNotificacao', notificacoesController.setUsuarioNotificacao);
router.put('/notificacao/setTexto/:idNotificacao', notificacoesController.setTextoNotificacao);
router.put('/notificacao/setImagem/:idNotificacao', notificacoesController.setImagemNotificacao);
router.put('/notificacao/setData/:idNotificacao', notificacoesController.setDataNotificacao);
router.delete('/notificacao/:idNotificacao', notificacoesController.deletarNotificacao);

module.exports = router;