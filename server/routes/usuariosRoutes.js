const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { verifyToken } = require('../middlewares/AuthMiddleware');
const protegerRotas = require('../utils/protegerRotas');

router.post('/usuario', usuariosController.criarUsuario);
router.get('/usuario', verifyToken, usuariosController.listarUsuarios);
router.get('/usuario/selecionarPorId/:idUsuario', verifyToken, usuariosController.selecionarUsuarioPorId);
router.get('/usuario/listarPorNome', verifyToken, usuariosController.listarUsuariosPorNome);
router.get('/usuario/listarPorEmail', usuariosController.selecionarUsuarioPorEmail);
router.post('/usuario/login', usuariosController.login);
router.put('/usuario/:idUsuario', verifyToken, usuariosController.atualizarUsuario);
router.put('/usuario/setNome/:idUsuario', verifyToken, usuariosController.setNomeUsuario);
router.put('/usuario/setEmail/:idUsuario', verifyToken, usuariosController.setEmailUsuario);
router.put('/usuario/setSenha/:idUsuario', verifyToken, usuariosController.setSenhaUsuario);
router.put('/usuario/setNotificacao/:idUsuario', verifyToken, usuariosController.setNotificacaoUsuario);
router.delete('/usuario/:idUsuario', verifyToken, usuariosController.deletarUsuario);

module.exports = router;