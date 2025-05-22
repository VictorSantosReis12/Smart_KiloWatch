const connection = require('../config/db');

exports.criarEletrodomestico = (req, res) => {
    const { idUsuario, tipo, marca, modelo, imagem, consumoKwhMes, consumoKwhDia, manterTempo } = req.body;

    const query = 'INSERT INTO Eletrodomesticos (id_usuario, tipo, marca, modelo, imagem, consumo_kwh_mes, consumo_kwh_dia, manter_tempo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [idUsuario, tipo, marca, modelo, imagem, consumoKwhMes, consumoKwhDia, manterTempo];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar eletrodoméstico.' });
        }
        res.json({ success: true, message: 'Eletrodoméstico cadastrado com sucesso!', data: results.insertId });
    });
}

exports.listarEletrodomesticos = (req, res) => {
    const query = 'SELECT * FROM Eletrodomesticos';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar os eletrodomésticos.'});
        }
        
        res.json({ success: true, message: 'Eletrodomésticos selecionados com sucesso!', data: results});
    });
}

exports.selecionarEletrodomesticoPorId = (req, res) => {
    const query = 'SELECT * FROM Eletrodomesticos WHERE id_eletrodomestico = ?';
    const params = [req.params.idEletrodomestico];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar o eletrodoméstico.'});
        }

        res.json({ success: true, message: 'Eletrodoméstico selecionado com sucesso!', data: results[0] });
    });
}

exports.listarEletrodomesticosPorUsuario = (req, res) => {
    const query = 'SELECT * FROM Eletrodomesticos WHERE id_usuario = ?';
    const params = [req.params.idUsuario];
    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar eletrodomésticos.' });
        }

        res.json({ success: true, message: 'Eletrodomésticos selecionados com sucesso!.', data: results });
    });
}

exports.atualizarEletrodomestico = (req, res) => {
    const { idUsuario, tipo, marca, modelo, imagem, consumoKwhMes, consumoKwhDia, manterTempo } = req.body;
    const idEletrodomestico = req.params.idEletrodomestico;
    const params = [idUsuario, tipo, marca, modelo, imagem, consumoKwhMes, consumoKwhDia, manterTempo, idEletrodomestico];

    const query = 'UPDATE Eletrodomesticos SET id_usuario = ?, tipo = ?, marca = ?, modelo = ?, imagem = ?, consumo_kwh_mes = ?, consumo_kwh_dia = ?, manter_tempo = ? WHERE id_eletrodomestico = ?';
    
    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o eletrodoméstico.'});
        }

        res.json({ success: true, message: 'Eletrodoméstico atualizado com sucesso!'});
    });
}

exports.setUsuarioEletrodomestico = (req, res) => {
    const idUsuario = req.body.idUsuario;
    const idEletrodomestico = req.params.idEletrodomestico;
    const query = 'UPDATE Eletrodomesticos SET id_usuario = ? WHERE id_eletrodomestico = ?';
    const params = [idUsuario, idEletrodomestico];

    connection.query(query, params, (err, results) => {
        if (err || results.affectedRows === 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o usuário do eletrodoméstico.'});
        }
        res.json({ success: true, message: 'Usuário do eletrodoméstico atualizado com sucesso!'});
    });
}

exports.setTipoEletrodomestico = (req, res) => {
    const tipo = req.body.tipo;
    const idEletrodomestico = req.params.idEletrodomestico;
    const query = 'UPDATE Eletrodomesticos SET tipo = ? WHERE id_eletrodomestico = ?';
    const params = [tipo, idEletrodomestico];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o tipo do eletrodoméstico.'});
        }
        res.json({ success: true, message: 'Tipo do eletrodoméstico atualizado com sucesso!'});
    });
}

exports.setMarcaEletrodomestico = (req, res) => {
    const marca = req.body.marca;
    const idEletrodomestico = req.params.idEletrodomestico;
    const query = 'UPDATE Eletrodomesticos SET marca = ? WHERE id_eletrodomestico = ?';
    const params = [marca, idEletrodomestico];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a marca do eletrodoméstico.'});
        }
        res.json({ success: true, message: 'Marca do eletrodoméstico atualizado com sucesso!'});
    });
}

exports.setModeloEletrodomestico = (req, res) => {
    const modelo = req.body.modelo;
    const idEletrodomestico = req.params.idEletrodomestico;
    const query = 'UPDATE Eletrodomesticos SET modelo = ? WHERE id_eletrodomestico = ?';
    const params = [modelo, idEletrodomestico];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o modelo do eletrodoméstico.'});
        }
        res.json({ success: true, message: 'Modelo do eletrodoméstico atualizado com sucesso!'});
    });
}

exports.setImagemEletrodomestico = (req, res) => {
    const imagem = req.body.imagem;
    const idEletrodomestico = req.params.idEletrodomestico;
    const query = 'UPDATE Eletrodomesticos SET imagem = ? WHERE id_eletrodomestico = ?';
    const params = [imagem, idEletrodomestico];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a imagem do eletrodoméstico.'});
        }
        res.json({ success: true, message: 'Imagem do eletrodoméstico atualizado com sucesso!'});
    });
}

exports.setConsumoMensalEletrodomestico = (req, res) => {
    const consumoKwhMes = req.body.consumoKwhMes;
    const idEletrodomestico = req.params.idEletrodomestico;
    const query = 'UPDATE Eletrodomesticos SET consumo_kwh_mes = ? WHERE id_eletrodomestico = ?';
    const params = [consumoKwhMes, idEletrodomestico];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o consumo mensal do eletrodoméstico.'});
        }
        res.json({ success: true, message: 'Consumo mensal do eletrodoméstico atualizado com sucesso!'});
    });
}

exports.setConsumoDiarioEletrodomestico = (req, res) => {
    const consumoKwhDia = req.body.consumoKwhDia;
    const idEletrodomestico = req.params.idEletrodomestico;
    const query = 'UPDATE Eletrodomesticos SET consumo_kwh_dia = ? WHERE id_eletrodomestico = ?';
    const params = [consumoKwhDia, idEletrodomestico];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o consumo diário do eletrodoméstico.'});
        }
        res.json({ success: true, message: 'Consumo diário do eletrodoméstico atualizado com sucesso!'});
    });
}

exports.setManterTempoEletrodomestico = (req, res) => {
    const manterTempo = req.body.manterTempo;
    const idEletrodomestico = req.params.idEletrodomestico;
    const query = 'UPDATE Eletrodomesticos SET manter_tempo_uso = ? WHERE id_eletrodomestico = ?';
    const params = [manterTempo, idEletrodomestico];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar manter tempo do eletrodoméstico.'});
        }
        res.json({ success: true, message: 'Manter tempo do eletrodoméstico atualizado com sucesso!'});
    });
}

exports.deletarEletrodomestico = (req, res) => {
    const query = 'DELETE FROM Eletrodomesticos WHERE id_eletrodomestico = ?';
    const params = [req.params.idEletrodomestico];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao deletar o eletrodoméstico.'});
        }
        res.json({ success: true, message: 'Eletrodoméstico deletado com sucesso!'});
    });
}