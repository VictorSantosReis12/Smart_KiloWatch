const connection = require('../config/db');

exports.criarTarifa = (req, res) => {
    const { estado, tarifaKwh, tarifaM3 } = req.body;

    const query = 'INSERT INTO Tarifas (estado, tarifa_kwh, tarifa_m3) VALUES (?, ?, ?)';
    const params = [estado, tarifaKwh, tarifaM3];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar tarifa.' });
        }
        res.json({ success: true, message: 'Tarifa cadastrada com sucesso!', data: results.insertId });
    });
}

exports.listarTarifas = (req, res) => {
    const query = 'SELECT * FROM Tarifas';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar as tarifas.'});
        }
        
        res.json({ success: true, message: 'Tarifas selecionadas com sucesso!', data: results});
    });
}

exports.selecionarTarifaPorId = (req, res) => {
    const query = 'SELECT * FROM Tarifas WHERE id_tarifa = ?';
    const params = [req.params.idTarifa];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar a tarifa.'});
        }

        res.json({ success: true, message: 'Tarifa selecionada com sucesso!', data: results[0] });
    });
}

exports.selecionarTarifaPorEstado = (req, res) => {
    const query = 'SELECT * FROM Tarifas WHERE estado = ?';
    const params = [req.body.estado];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar a tarifa.'});
        }

        res.json({ success: true, message: 'Tarifa selecionada com sucesso!', data: results[0] });
    });
}

exports.atualizarTarifa = (req, res) => {
    const { estado, tarifaKwh, tarifaM3 } = req.body;
    const idMeta = req.params.idTarifa;
    const params = [estado, tarifaKwh, tarifaM3, idTarifa];

    const query = 'UPDATE Tarifas SET estado = ?, tarifa_kwh = ?, tarifa_m3 = ? WHERE id_tarifa = ?';
    
    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a tarifa.'});
        }

        res.json({ success: true, message: 'Tarifa atualizada com sucesso!'});
    });
}

exports.setEstadoTarifa = (req, res) => {
    const estado = req.body.estado;
    const idTarifa = req.params.idTarifa;
    const query = 'UPDATE Tarifas SET estado = ? WHERE id_tarifa = ?';
    const params = [estado, idTarifa];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o estado da tarifa.'});
        }
        res.json({ success: true, message: 'Estado da tarifa atualizado com sucesso!'});
    });
}

exports.setEnergiaTarifa = (req, res) => {
    const tarifaKwh = req.body.tarifaKwh;
    const idTarifa = req.params.idTarifa;
    const query = 'UPDATE Tarifas SET tarifa_kwh = ? WHERE id_tarifa = ?';
    const params = [tarifaKwh, idTarifa];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o valor do kWh da tarifa.'});
        }
        res.json({ success: true, message: 'Valor do kWh da tarifa atualizado com sucesso!'});
    });
}

exports.setAguaTarifa = (req, res) => {
    const tarifaM3 = req.body.tarifaM3;
    const idTarifa = req.params.idTarifa;
    const query = 'UPDATE Tarifas SET tarifa_m3 = ? WHERE id_tarifa = ?';
    const params = [tarifaM3, idTarifa];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o valor do m³ da tarifa.'});
        }
        res.json({ success: true, message: 'Valor do m³ da tarifa atualizado com sucesso!'});
    });
}

exports.deletarTarifa = (req, res) => {
    const query = 'DELETE FROM Tarifas WHERE id_tarifa = ?';
    const params = [req.params.idTarifa];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao deletar a tarifa.'});
        }
        res.json({ success: true, message: 'Tarifa deletada com sucesso!'});
    });
}