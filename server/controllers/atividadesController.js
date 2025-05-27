const connection = require('../config/db');

exports.criarAtividade = (req, res) => {
    const { idUsuario, nome, imagem, litrosMinuto, isTempoUso, manterTempoUso } = req.body;

    const query = 'INSERT INTO Atividades (id_usuario, nome, imagem, litros_minuto, is_tempo_uso, manter_tempo_uso) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [idUsuario, nome, imagem, litrosMinuto, isTempoUso, manterTempoUso];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar atividade.' });
        }
        res.json({ success: true, message: 'Atividade cadastrada com sucesso!', data: results.insertId });
    });
}

exports.listarAtividades = (req, res) => {
    const query = 'SELECT * FROM Atividades';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar as atividades.'});
        }
        
        res.json({ success: true, message: 'Atividades selecionadas com sucesso!', data: results});
    });
}

exports.selecionarAtividadePorId = (req, res) => {
    const query = 'SELECT * FROM Atividades WHERE id_atividade = ?';
    const params = [req.params.idAtividade];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar a atividade.'});
        }

        res.json({ success: true, message: 'Atividade selecionada com sucesso!', data: results[0] });
    });
}

exports.listarAtividadesPorUsuario = (req, res) => {
    const query = 'SELECT * FROM Atividades WHERE id_usuario = ?';
    const params = [req.params.idUsuario];
    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar atividades.' });
        }

        res.json({ success: true, message: 'Atividades selecionadas com sucesso!', data: results });
    });
}

exports.atualizarAtividade = (req, res) => {
    const { idUsuario, nome, imagem, litrosMinuto, isTempoUso, manterTempoUso } = req.body;
    const idAtividade = req.params.idAtividade;
    const params = [idUsuario, nome, imagem, litrosMinuto, isTempoUso, manterTempoUso, idAtividade];

    const query = 'UPDATE Atividades SET id_usuario = ?, nome = ?, imagem = ?, litros_minuto = ?, is_tempo_uso = ?, manter_tempo_uso = ? WHERE id_atividade = ?';
    
    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a atividade.'});
        }

        res.json({ success: true, message: 'Atividade atualizada com sucesso!'});
    });
}

exports.setUsuarioAtividade = (req, res) => {
    const idUsuario = req.body.idUsuario;
    const idAtividade = req.params.idAtividade;
    const query = 'UPDATE Atividades SET id_usuario = ? WHERE id_atividade = ?';
    const params = [idUsuario, idAtividade];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o usuário da atividade.'});
        }
        res.json({ success: true, message: 'Usuário da atividade atualizado com sucesso!'});
    });
}

exports.setNomeAtividade = (req, res) => {
    const nome = req.body.nome;
    const idAtividade = req.params.idAtividade;
    const query = 'UPDATE Atividades SET nome = ? WHERE id_atividade = ?';
    const params = [nome, idAtividade];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o nome da atividade.'});
        }
        res.json({ success: true, message: 'Nome da atividade atualizado com sucesso!'});
    });
}

exports.setImagemAtividade = (req, res) => {
    const imagem = req.body.imagem;
    const idAtividade = req.params.idAtividade;
    const query = 'UPDATE Atividades SET imagem = ? WHERE id_atividade = ?';
    const params = [imagem, idAtividade];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a imagem da atividade.'});
        }
        res.json({ success: true, message: 'Imagem da atividade atualizado com sucesso!'});
    });
}

exports.setLitrosMinutoAtividade = (req, res) => {
    const litrosMinuto = req.body.litrosMinuto;
    const idAtividade = req.params.idAtividade;
    const query = 'UPDATE Atividades SET litros_minuto = ? WHERE id_atividade = ?';
    const params = [litrosMinuto, idAtividade];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar os litros por minuto da atividade.'});
        }
        res.json({ success: true, message: 'Litros por minuto da atividade atualizado com sucesso!'});
    });
}

exports.setIsTempoUsoAtividade = (req, res) => {
    const isTempoUso = req.body.isTempoUso;
    const idAtividade = req.params.idAtividade;
    const query = 'UPDATE Atividades SET is_tempo_uso = ? WHERE id_atividade = ?';
    const params = [isTempoUso, idAtividade];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar se a atividade é por tempo ou uso.'});
        }
        res.json({ success: true, message: 'Se a atividade é por tempo ou uso atualizado com sucesso!'});
    });
}

exports.setManterTempoUsoAtividade = (req, res) => {
    const manterTempoUso = req.body.manterTempoUso;
    const idAtividade = req.params.idAtividade;
    const query = 'UPDATE Atividades SET manter_tempo_uso = ? WHERE id_atividade = ?';
    const params = [manterTempoUso, idAtividade];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar manter tempo ou uso da atividade.'});
        }
        res.json({ success: true, message: 'Manter tempo ou uso da atividade atualizado com sucesso!'});
    });
}

exports.deletarAtividade = (req, res) => {
    const query = 'DELETE FROM Atividades WHERE id_atividade = ?';
    const params = [req.params.idAtividade];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao deletar a atividade.'});
        }
        res.json({ success: true, message: 'Atividade deletada com sucesso!'});
    });
}