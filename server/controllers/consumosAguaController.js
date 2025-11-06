const connection = require('../config/db');

exports.criarConsumoAgua = (req, res) => {
    const { idAtividade, tempoUso, tipo, dataRegistro } = req.body;

    const query = 'INSERT INTO ConsumoAgua (id_atividade, tempo_uso, tipo) VALUES (?, ?, ?)';
    const params = [idAtividade, tempoUso, tipo, dataRegistro];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar consumo de água.' });
        }
        res.json({ success: true, message: 'Consumo de água cadastrado com sucesso!', data: results.insertId });
    });
}

exports.listarConsumosAgua = (req, res) => {
    const query = 'SELECT * FROM ConsumoAgua';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar os consumos de água.'});
        }
        
        res.json({ success: true, message: 'Consumos de água selecionados com sucesso!', data: results});
    });
}

exports.selecionarConsumoAguaPorId = (req, res) => {
    const query = 'SELECT * FROM ConsumoAgua WHERE id_consumo_agua = ?';
    const params = [req.params.idConsumoAgua];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar o consumo de água.'});
        }

        res.json({ success: true, message: 'Consumo de água selecionado com sucesso!', data: results[0] });
    });
}

exports.listarConsumosAguaPorAtividade = (req, res) => {
    const query = 'SELECT * FROM ConsumoAgua WHERE id_atividade = ?';
    const params = [req.params.idAtividade];
    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar consumos de água.' });
        }

        res.json({ success: true, message: 'Consumos de água selecionados com sucesso!', data: results });
    });
}

exports.listarConsumosAguaPorData = (req, res) => {
    const query = 'SELECT * FROM ConsumoAgua WHERE data_registro = ?';
    const params = [req.body.dataRegistro];
    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar consumos de água.' });
        }

        res.json({ success: true, message: 'Consumos de água selecionados com sucesso!', data: results });
    });
}

exports.atualizarConsumoAgua = (req, res) => {
    const { idAtividade, tempoUso, tipo, dataRegistro } = req.body;
    const idConsumoAgua = req.params.idConsumoAgua;
    const params = [idAtividade, tempoUso, tipo, dataRegistro, idConsumoAgua];

    const query = 'UPDATE ConsumoAgua SET id_atividade = ?, tempo_uso = ?, tipo = ?, data_registro = ? WHERE id_consumo_agua = ?';
    
    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o consumo de água.'});
        }

        res.json({ success: true, message: 'Consumo de água atualizado com sucesso!'});
    });
}

exports.setAtividadeConsumoAgua = (req, res) => {
    const idAtividade = req.body.idAtividade;
    const idConsumoAgua = req.params.idConsumoAgua;
    const query = 'UPDATE ConsumoAgua SET id_atividade = ? WHERE id_consumo_agua = ?';
    const params = [idAtividade, idConsumoAgua];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a atividade do consumo de água.'});
        }
        res.json({ success: true, message: 'Atividade do consumo de água atualizado com sucesso!'});
    });
}

exports.setTempoConsumoAgua = (req, res) => {
    const tempoUso = req.body.tempoUso;
    const idConsumoAgua = req.params.idConsumoAgua;
    const query = 'UPDATE ConsumoAgua SET tempo_uso = ? WHERE id_consumo_agua = ?';
    const params = [tempoUso, idConsumoAgua];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o tempo ou uso do consumo de água.'});
        }
        res.json({ success: true, message: 'Tempo ou uso do consumo de água atualizado com sucesso!'});
    });
}

exports.setTipoConsumoAgua = (req, res) => {
    const tipo = req.body.tipo;
    const idConsumoAgua = req.params.idConsumoAgua;
    const query = 'UPDATE ConsumoAgua SET tipo = ? WHERE id_consumo_agua = ?';
    const params = [tipo, idConsumoAgua];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o tipo do consumo de água.'});
        }
        res.json({ success: true, message: 'Tempo ou uso do consumo de água atualizado com sucesso!'});
    });
}

exports.setDataConsumoAgua = (req, res) => {
    const dataRegistro = req.body.dataRegistro;
    const idConsumoAgua = req.params.idConsumoAgua;
    const query = 'UPDATE ConsumoAgua SET data_registro = ? WHERE id_consumo_agua = ?';
    const params = [dataRegistro, idConsumoAgua];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a data de registro do consumo de água.'});
        }
        res.json({ success: true, message: 'Data de registro do consumo de água atualizado com sucesso!'});
    });
}

exports.deletarConsumoAgua = (req, res) => {
    const query = 'DELETE FROM ConsumoAgua WHERE id_consumo_agua = ?';
    const params = [req.params.idConsumoAgua];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao deletar o consumo de água.'});
        }
        res.json({ success: true, message: 'Consumo de água deletado com sucesso!'});
    });
}