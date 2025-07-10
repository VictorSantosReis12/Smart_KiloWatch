const connection = require('../config/db');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'senhajwt';

exports.criarUsuario = (req, res) => {
    const { nome, email, senha, ativarNotificacao } = req.body;
    const saltRounds = 10;

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'E-mail inválido!' });
    }

    bcrypt.hash(senha, saltRounds, (err, senhaCriptografada) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao criptografar senha.' });
        }

        const query = 'INSERT INTO Usuarios (nome, email, senha, ativar_notificacao) VALUES (?, ?, ?, ?)';
        const params = [nome, email, senhaCriptografada, ativarNotificacao];

        connection.query(query, params, (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário.' });
            }
            res.json({ success: true, message: 'Usuário cadastrado com sucesso!', data: results.insertId });
        });
    });
}

exports.listarUsuarios = (req, res) => {
    const query = 'SELECT id_usuario, nome, email, ativar_notificacao FROM Usuarios';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar os usuários.' });
        }

        results.forEach((usuario) => usuario.ativar_notificacao = usuario.ativar_notificacao === 1);

        res.json({ success: true, message: 'Usuários selecionados com sucesso!', data: results });
    });
}

exports.selecionarUsuarioPorId = (req, res) => {
    const query = 'SELECT * FROM Usuarios WHERE id_usuario = ?';
    const params = [req.params.idUsuario];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar o usuário.' });
        }

        if (results.length > 0) {
            results.forEach((usuario) => {
                delete usuario.senha
                usuario.ativar_notificacao = usuario.ativar_notificacao === 1
            });
        }

        res.json({ success: true, message: 'Usuário selecionado com sucesso!', data: results[0] });
    });
}

exports.listarUsuariosPorNome = (req, res) => {
    const query = 'SELECT * FROM Usuarios WHERE nome LIKE ?';
    const params = [`%${req.query.nome}%`];
    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar usuários.' });
        }
        if (results.length > 0) {
            results.forEach((usuario) => {
                delete usuario.senha
                usuario.ativar_notificacao = usuario.ativar_notificacao === 1
            });
        }

        res.json({ success: true, data: results });
    });
}

exports.selecionarUsuarioPorEmail = (req, res) => {
    const query = 'SELECT * FROM Usuarios WHERE email = ?';
    const params = [req.query.email];
    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar usuários.' });
        }

        if (results.length > 0) {
            results.forEach((usuario) => {
                delete usuario.senha
                usuario.ativar_notificacao = usuario.ativar_notificacao === 1
            });
        }

        res.json({ success: true, data: results.length > 0 ? results[0] : null });
    });
}

exports.login = (req, res) => {
    const { email, senha } = req.body;

    const query = 'SELECT * FROM Usuarios WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao buscar usuário.' });

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }

        const usuario = results[0];

        bcrypt.compare(senha, usuario.senha, (err, isMatch) => {
            if (err) return res.status(500).json({ success: false, message: 'Erro ao verificar senha.' });

            if (!isMatch) return res.status(401).json({ success: false, message: 'Senha incorreta.' });

            delete usuario.senha;
            usuario.ativar_notificacao = usuario.ativar_notificacao === 1;

            const token = jwt.sign({ id_usuario: usuario.id_usuario, nome: usuario.nome, email: usuario.email }, jwtSecret);

            res.status(200).json({ success: true, token, data: usuario });
        });
    });
}

exports.atualizarUsuario = (req, res) => {
    const { nome, email, senhaAtual, senhaNova, ativarNotificacao } = req.body;
    const { idUsuario } = req.params;

    const selectQuery = 'SELECT senha FROM Usuarios WHERE id_usuario = ?';

    connection.query(selectQuery, [idUsuario], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao buscar usuário.' });

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }

        const senhaSalva = results[0].senha;

        bcrypt.compare(senhaAtual, senhaSalva, (err, isMatch) => {
            if (err) return res.status(500).json({ success: false, message: 'Erro ao verificar senha.' });

            if (!isMatch) return res.status(401).json({ success: false, message: 'Senha incorreta.' });

            const saltRounds = 10;
            bcrypt.hash(senhaNova, saltRounds, (err, senhaNovaCriptografada) => {
                if (err) return res.status(500).json({ success: false, message: 'Erro ao criptografar nova senha.' });

                const updateQuery = 'UPDATE Usuarios SET nome = ?, email = ?, senha = ?, ativar_notificacao = ? WHERE id_usuario = ?';
                const params = [nome, email, senhaNovaCriptografada, ativarNotificacao, idUsuario];

                connection.query(updateQuery, params, (err, results) => {
                    if (err) return res.status(500).json({ success: false, message: 'Erro ao atualizar o usuário.' });

                    const token = jwt.sign({ id_usuario: idUsuario, nome, email }, jwtSecret, { expiresIn: '1h' });

                    res.json({
                        success: true,
                        message: 'Usuário atualizado com sucesso!',
                        token,
                        data: { id_usuario: idUsuario, nome, email, ativarNotificacao }
                    });
                });
            });
        });
    });
}

exports.setNomeUsuario = (req, res) => {
    const nome = req.body.nome;
    const idUsuario = req.params.idUsuario;
    const query = 'UPDATE Usuarios SET nome = ? WHERE id_usuario = ?';
    const params = [nome, idUsuario];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o nome do usuário.' });
        }
        res.json({ success: true, message: 'Nome do usuário atualizado com sucesso!' });
    });
}

exports.setEmailUsuario = (req, res) => {
    const email = req.body.email;
    const idUsuario = req.params.idUsuario;
    const query = 'UPDATE Usuarios SET email = ? WHERE id_usuario = ?';
    const params = [email, idUsuario];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o email do usuário.' });
        }
        res.json({ success: true, message: 'Email do usuário atualizado com sucesso!' });
    });
}

exports.setSenhaUsuario = (req, res) => {
    const { senhaAtual, senhaNova } = req.body;
    const idUsuario = req.params.idUsuario;
    const selectQuery = 'SELECT senha FROM Usuarios WHERE id_usuario = ?';

    connection.query(selectQuery, [idUsuario], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao buscar usuário.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }

        const senhaSalva = results[0].senha;

        bcrypt.compare(senhaAtual, senhaSalva, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Erro ao verificar senha.' });
            }

            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Senha incorreta.' });
            }

            const saltRounds = 10;
            bcrypt.hash(senhaNova, saltRounds, (err, senhaNovaCriptografada) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Erro ao criptografar nova senha.' });
                }

                const updateQuery = 'UPDATE Usuarios SET senha = ? WHERE id_usuario = ?';
                const params = [senhaNovaCriptografada, idUsuario];

                connection.query(updateQuery, params, (err, results) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: 'Erro ao atualizar a senha do usuário.' });
                    }

                    res.json({ success: true, message: 'Senha do usuário atualizado com sucesso!' });
                });
            });
        });
    });
}

exports.setNotificacaoUsuario = (req, res) => {
    const ativarNotificacao = req.body.ativarNotificacao;
    const idUsuario = req.params.idUsuario;
    const query = 'UPDATE Usuarios SET ativar_notificacao = ? WHERE id_usuario = ?';
    const params = [ativarNotificacao, idUsuario];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o ativar notificações do usuário.' });
        }
        res.json({ success: true, message: 'Ativar notificações do usuário atualizado com sucesso!' });
    });
}

exports.deletarUsuario = (req, res) => {
    const query = 'DELETE FROM Usuarios WHERE id_usuario = ?';
    const params = [req.params.idUsuario];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao deletar o usuário.' });
        }
        res.json({ success: true, message: 'Usuário deletado com sucesso!' });
    });
}