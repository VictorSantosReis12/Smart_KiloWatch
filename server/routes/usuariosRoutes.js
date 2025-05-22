const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.post('/usuario', usuariosController.criarUsuario);
router.get('/usuario', usuariosController.listarUsuarios);
router.get('/usuario/selecionarPorId/:idUsuario', usuariosController.selecionarUsuarioPorId);
router.get('/usuario/listarPorNome', usuariosController.listarUsuariosPorNome);
router.get('/usuario/listarPorEmail', usuariosController.selecionarUsuarioPorEmail);
router.post('/usuario/login', usuariosController.login);
router.put('/usuario/:idUsuario', usuariosController.atualizarUsuario);
router.put('/usuario/setNome/:idUsuario', usuariosController.setNomeUsuario);
router.put('/usuario/setEmail/:idUsuario', usuariosController.setEmailUsuario);
router.put('/usuario/setSenha/:idUsuario', usuariosController.setSenhaUsuario);
router.put('/usuario/setNotificacao/:idUsuario', usuariosController.setNotificacaoUsuario);
router.delete('/usuario/:idUsuario', usuariosController.deletarUsuario);

module.exports = router;