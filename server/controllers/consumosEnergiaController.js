const connection = require('../config/db');

exports.criarConsumoEnergia = (req, res) => {
    const { idEletrodomestico, tempo, dataRegistro } = req.body;

    const query = 'INSERT INTO ConsumoEnergia (id_eletrodomestico, tempo, data_registro) VALUES (?, ?, ?)';
    const params = [idEletrodomestico, tempo, dataRegistro];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar consumo de energia.' });
        }
        res.json({ success: true, message: 'Consumo de energia cadastrado com sucesso!', data: results.insertId });
    });
}

exports.listarConsumosEnergia = (req, res) => {
    const query = 'SELECT * FROM ConsumoEnergia';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar os consumos de energia.'});
        }
        
        res.json({ success: true, message: 'Consumos de energia selecionados com sucesso!', data: results});
    });
}

exports.selecionarConsumoEnergiaPorId = (req, res) => {
    const query = 'SELECT * FROM ConsumoEnergia WHERE id_consumo_energia = ?';
    const params = [req.params.idConsumoEnergia];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar o consumo de energia.'});
        }

        res.json({ success: true, message: 'Consumo de energia selecionado com sucesso!', data: results[0] });
    });
}

exports.listarConsumosEnergiaPorEletrodomestico = (req, res) => {
    const query = 'SELECT * FROM ConsumoEnergia WHERE id_eletrodomestico = ?';
    const params = [req.params.idEletrodomestico];
    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar consumos de energia.' });
        }

        res.json({ success: true, message: 'Consumos de energia selecionados com sucesso!', data: results });
    });
}

exports.listarConsumosEnergiaPorData = (req, res) => {
    const query = 'SELECT * FROM ConsumoEnergia WHERE data_registro = ?';
    const params = [req.body.dataRegistro];
    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar consumos de energia.' });
        }

        res.json({ success: true, message: 'Consumos de energia selecionados com sucesso!', data: results });
    });
}

exports.atualizarConsumoEnergia = (req, res) => {
    const { idEletrodomestico, tempo, dataRegistro } = req.body;
    const idConsumoEnergia = req.params.idConsumoEnergia;
    const params = [idEletrodomestico, tempo, dataRegistro, idConsumoEnergia];

    const query = 'UPDATE ConsumoEnergia SET id_eletrodomestico = ?, tempo = ?, data_registro = ? WHERE id_consumo_energia = ?';
    
    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o consumo de energia.'});
        }

        res.json({ success: true, message: 'Consumo de energia atualizado com sucesso!'});
    });
}

exports.setEletrodomesticoConsumoEnergia = (req, res) => {
    const idEletrodomestico = req.body.idAtividade;
    const idConsumoEnergia = req.params.idConsumoEnergia;
    const query = 'UPDATE ConsumoAgua SET id_eletrodomestico = ? WHERE id_consumo_energia = ?';
    const params = [idEletrodomestico, idConsumoEnergia];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a eletrodoméstico do consumo de energia.'});
        }
        res.json({ success: true, message: 'Eletrodoméstico do consumo de energia atualizado com sucesso!'});
    });
}

exports.setTempoConsumoEnergia = (req, res) => {
    const tempo = req.body.tempo;
    const idConsumoEnergia = req.params.idConsumoEnergia;
    const query = 'UPDATE ConsumoEnergia SET tempo = ? WHERE id_consumo_energia = ?';
    const params = [tempo, idConsumoEnergia];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o tempo do consumo de energia.'});
        }
        res.json({ success: true, message: 'Tempo do consumo de energia atualizado com sucesso!'});
    });
}

exports.setDataConsumoEnergia = (req, res) => {
    const dataRegistro = req.body.dataRegistro;
    const idConsumoEnergia = req.params.idConsumoEnergia;
    const query = 'UPDATE ConsumoEnergia SET data_registro = ? WHERE id_consumo_energia = ?';
    const params = [dataRegistro, idConsumoEnergia];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a data de registro do consumo de energia.'});
        }
        res.json({ success: true, message: 'Data de registro do consumo de energia atualizado com sucesso!'});
    });
}

exports.deletarConsumoEnergia = (req, res) => {
    const query = 'DELETE FROM ConsumoEnergia WHERE id_consumo_energia = ?';
    const params = [req.params.idConsumoEnergia];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao deletar o consumo de energia.'});
        }
        res.json({ success: true, message: 'Consumo de energia deletado com sucesso!'});
    });
}