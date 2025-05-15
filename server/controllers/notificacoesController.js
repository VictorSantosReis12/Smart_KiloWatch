const connection = require('../config/db');

exports.criarNotificacao = (req, res) => {
    const { idUsuario, texto, imagem, dataRegistro } = req.body;

    const query = 'INSERT INTO Notificacoes (id_usuario, texto, imagem, data_registro) VALUES (?, ?, ?, ?)';
    const params = [idUsuario, texto, imagem, dataRegistro];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar notificação.' });
        }
        res.json({ success: true, message: 'Notificação cadastrada com sucesso!', data: results.insertId });
    });
}

exports.listarNotificacoes = (req, res) => {
    const query = 'SELECT * FROM Notificacoes';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar as notificações.'});
        }
        
        res.json({ success: true, message: 'Notificações selecionadas com sucesso!', data: results});
    });
}

exports.selecionarNotificacaoPorId = (req, res) => {
    const query = 'SELECT * FROM Notificacoes WHERE id_notificacao = ?';
    const params = [req.params.idNotificacao];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar a notificação.'});
        }

        res.json({ success: true, message: 'Notificação selecionada com sucesso!', data: results[0] });
    });
}

exports.listarNotificacoesPorUsuario = (req, res) => {
    const query = 'SELECT * FROM Notificacoes WHERE id_usuario = ?';
    const params = [req.params.idUsuario];
    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar notificações.' });
        }

        res.json({ success: true, message: 'Notificações selecionadas com sucesso!', data: results });
    });
}

exports.atualizarNotificacao = (req, res) => {
    const { idUsuario, texto, imagem, dataRegistro } = req.body;
    const idMeta = req.params.idNotificacao;
    const params = [idUsuario, texto, imagem, dataRegistro, idMeta];

    const query = 'UPDATE Notificacoes SET id_usuario = ?, texto = ?, imagem = ?, data_registro = ? WHERE id_notificacao = ?';
    
    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a notificação.'});
        }

        res.json({ success: true, message: 'Notificação atualizada com sucesso!'});
    });
}

exports.setUsuarioNotificacao = (req, res) => {
    const idUsuario = req.body.idUsuario;
    const idMeta = req.params.idNotificacao;
    const query = 'UPDATE Notificacoes SET id_usuario = ? WHERE id_notificacao = ?';
    const params = [idUsuario, idNotificacao];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o usuário da notificação.'});
        }
        res.json({ success: true, message: 'Usuário da notificação atualizado com sucesso!'});
    });
}

exports.setTextoNotificacao = (req, res) => {
    const texto = req.body.texto;
    const idNotificacao = req.params.idNotificacao;
    const query = 'UPDATE Notificacoes SET texto = ? WHERE id_notificacao = ?';
    const params = [texto, idNotificacao];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o texto da notificação.'});
        }
        res.json({ success: true, message: 'Texto da notificação atualizado com sucesso!'});
    });
}

exports.setImagemNotificacao = (req, res) => {
    const imagem = req.body.imagem;
    const idNotificacao = req.params.idNotificacao;
    const query = 'UPDATE Notificacoes SET imagem = ? WHERE id_notificacao = ?';
    const params = [imagem, idNotificacao];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a imagem da notificação.'});
        }
        res.json({ success: true, message: 'Imagem da notificação atualizado com sucesso!'});
    });
}

exports.setDataNotificacao = (req, res) => {
    const dataRegistro = req.body.dataRegistro;
    const idNotificacao = req.params.idNotificacao;
    const query = 'UPDATE Notificacoes SET data_registro = ? WHERE id_notificacao = ?';
    const params = [dataRegistro, idNotificacao];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a data de registro da notificação.'});
        }
        res.json({ success: true, message: 'Data de registro da notificação atualizado com sucesso!'});
    });
}

exports.deletarNotificacao = (req, res) => {
    const query = 'DELETE FROM Notificacoes WHERE id_notificacao = ?';
    const params = [req.params.idNotificacao];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao deletar a notificação.'});
        }
        res.json({ success: true, message: 'Notificação deletada com sucesso!'});
    });
}