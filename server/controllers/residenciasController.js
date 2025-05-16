const connection = require('../config/db');

exports.criarResidencia = (req, res) => {
    const { idUsuario, estado, cidade, rua, numero, complemento } = req.body;

    const query = 'INSERT INTO Residencias (id_usuario, estado, cidade, rua, numero, complemento) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [idUsuario, estado, cidade, rua, numero, complemento];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar residência.' });
        }
        res.json({ success: true, message: 'Residência cadastrada com sucesso!', data: results.insertId });
    });
}

exports.listarResidencias = (req, res) => {
    const query = 'SELECT * FROM Residencias';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar as residências.'});
        }
        
        res.json({ success: true, message: 'Residências selecionadas com sucesso!', data: results});
    });
}

exports.selecionarResidenciaPorId = (req, res) => {
    const query = 'SELECT * FROM Residencias WHERE id_residencia = ?';
    const params = [req.params.idResidencia];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar a residência.'});
        }

        res.json({ success: true, message: 'Residência selecionada com sucesso!', data: results[0] });
    });
}

exports.listarResidenciasPorUsuario = (req, res) => {
    const query = 'SELECT * FROM Residencias WHERE id_usuario = ?';
    const params = [req.params.idUsuario];
    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar residências.' });
        }

        res.json({ success: true, message: 'Residências selecionadas com sucesso!', data: results });
    });
}

exports.atualizarResidencia = (req, res) => {
    const { idUsuario, estado, cidade, rua, numero, complemento } = req.body;
    const idResidencia = req.params.idResidencia;
    const params = [idUsuario, estado, cidade, rua, numero, complemento, idResidencia];

    const query = 'UPDATE Residencias SET id_usuario = ?, estado = ?, cidade = ?, rua = ?, numero = ?, complemento = ? WHERE id_residencia = ?';

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a residência.'});
        }

        res.json({ success: true, message: 'Residência atualizada com sucesso!'});
    });
}

exports.setUsuarioResidencia = (req, res) => {
    const idUsuario = req.body.idUsuario;
    const idResidencia = req.params.idResidencia;
    const query = 'UPDATE Residencias SET id_usuario = ? WHERE id_residencia = ?';
    const params = [idUsuario, idResidencia];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o usuário da residência.'});
        }
        res.json({ success: true, message: 'Usuário da residência atualizado com sucesso!'});
    });
}

exports.setEstadoResidencia = (req, res) => {
    const estado = req.body.estado;
    const idResidencia = req.params.idResidencia;
    const query = 'UPDATE Residencias SET estado = ? WHERE id_residencia = ?';
    const params = [estado, idResidencia];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o estado da residência.'});
        }
        res.json({ success: true, message: 'Estado da residência atualizado com sucesso!'});
    });
}

exports.setCidadeResidencia = (req, res) => {
    const cidade = req.body.cidade;
    const idResidencia = req.params.idResidencia;
    const query = 'UPDATE Residencias SET cidade = ? WHERE id_residencia = ?';
    const params = [cidade, idResidencia];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a cidade da residência.'});
        }
        res.json({ success: true, message: 'Cidade da residência atualizada com sucesso!'});
    });
}
exports.setRuaResidencia = (req, res) => {
    const rua = req.body.rua;
    const idResidencia = req.params.idResidencia;
    const query = 'UPDATE Residencias SET rua = ? WHERE id_residencia = ?';
    const params = [rua, idResidencia];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a rua da residência.'});
        }
        res.json({ success: true, message: 'Rua da residência atualizada com sucesso!'});
    });
}

exports.setNumeroResidencia = (req, res) => {
    const numero = req.body.numero;
    const idResidencia = req.params.idResidencia;
    const query = 'UPDATE Residencias SET numero = ? WHERE id_residencia = ?';
    const params = [numero, idResidencia];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o número da residência.'});
        }
        res.json({ success: true, message: 'Número da residência atualizado com sucesso!'});
    });
}

exports.setComplementoResidencia = (req, res) => {
    const complemento = req.body.complemento;
    const idResidencia = req.params.idResidencia;
    const query = 'UPDATE Residencias SET complemento = ? WHERE id_residencia = ?';
    const params = [complemento, idResidencia];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o complemento da residência.'});
        }
        res.json({ success: true, message: 'Complemento da residência atualizado com sucesso!'});
    });
}

exports.deletarResidencia = (req, res) => {
    const query = 'DELETE FROM Residencias WHERE id_residencia = ?';
    const params = [req.params.idResidencia];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao deletar a residência.'});
        }
        res.json({ success: true, message: 'Residência deletada com sucesso!'});
    });
}