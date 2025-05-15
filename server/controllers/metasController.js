const connection = require('../config/db');

exports.criarMeta = (req, res) => {
    const { idUsuario, metaEnergia, metaAgua, dataRegistro } = req.body;

    const query = 'INSERT INTO Metas (id_usuario, meta_energia, meta_agua, data_registro) VALUES (?, ?, ?, ?)';
    const params = [idUsuario, metaEnergia, metaAgua, dataRegistro];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar meta.' });
        }
        res.json({ success: true, message: 'Meta cadastrada com sucesso!', data: results.insertId });
    });
}

exports.listarMetas = (req, res) => {
    const query = 'SELECT * FROM Metas';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar as metas.'});
        }
        
        res.json({ success: true, message: 'Metas selecionadas com sucesso!', data: results});
    });
}

exports.selecionarMetaPorId = (req, res) => {
    const query = 'SELECT * FROM Metas WHERE id_meta = ?';
    const params = [req.params.idMeta];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar a meta.'});
        }

        res.json({ success: true, message: 'Meta selecionada com sucesso!', data: results[0] });
    });
}

exports.listarMetasPorUsuario = (req, res) => {
    const query = 'SELECT * FROM Metas WHERE id_meta = ?';
    const params = [req.params.idUsuario];
    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar metas.' });
        }

        res.json({ success: true, message: 'Metas selecionadas com sucesso!', data: results });
    });
}

exports.atualizarMeta = (req, res) => {
    const { idUsuario, metaEnergia, metaAgua, dataRegistro } = req.body;
    const idMeta = req.params.idMeta;
    const params = [idUsuario, metaEnergia, metaAgua, dataRegistro, idMeta];

    const query = 'UPDATE Metas SET id_usuario = ?, meta_energia = ?, meta_agua = ?, data_registro = ? WHERE id_meta = ?';
    
    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a meta.'});
        }

        res.json({ success: true, message: 'Meta atualizada com sucesso!'});
    });
}

exports.setUsuarioMeta = (req, res) => {
    const idUsuario = req.body.idUsuario;
    const idMeta = req.params.idMeta;
    const query = 'UPDATE Metas SET id_usuario = ? WHERE id_meta = ?';
    const params = [idUsuario, idMeta];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o usuário da meta.'});
        }
        res.json({ success: true, message: 'Usuário da meta atualizado com sucesso!'});
    });
}

exports.setEnergiaMeta = (req, res) => {
    const metaEnergia = req.body.metaEnergia;
    const idMeta = req.params.idMeta;
    const query = 'UPDATE Metas SET meta_energia = ? WHERE id_meta = ?';
    const params = [metaEnergia, idMeta];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o valor de energia da meta.'});
        }
        res.json({ success: true, message: 'Valor de energia da meta atualizado com sucesso!'});
    });
}

exports.setAguaMeta = (req, res) => {
    const metaAgua = req.body.metaAgua;
    const idMeta = req.params.idMeta;
    const query = 'UPDATE Metas SET meta_agua = ? WHERE id_meta = ?';
    const params = [metaAgua, idMeta];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o valor de água da meta.'});
        }
        res.json({ success: true, message: 'Valor de água da meta atualizado com sucesso!'});
    });
}

exports.setDataMeta = (req, res) => {
    const dataRegistro = req.body.dataRegistro;
    const idMeta = req.params.idMeta;
    const query = 'UPDATE Metas SET data_registro = ? WHERE id_meta = ?';
    const params = [dataRegistro, idMeta];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a data de registro da meta.'});
        }
        res.json({ success: true, message: 'Data de registro da meta atualizado com sucesso!'});
    });
}

exports.deletarMeta = (req, res) => {
    const query = 'DELETE FROM Metas WHERE id_meta = ?';
    const params = [req.params.idMeta];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao deletar a meta.'});
        }
        res.json({ success: true, message: 'Meta deletada com sucesso!'});
    });
}