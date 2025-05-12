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

exports.listarCustosPorUsuario = (req, res) => {
    const query = 'SELECT * FROM Custos WHERE id_custo = ?';
    const params = [req.params.idUsuario];
    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar custos.' });
        }

        res.json({ success: true, message: 'Custos selecionados com sucesso!', data: results });
    });
}

exports.selecionarCustoPorData = (req, res) => {
    const query = 'SELECT * FROM Custos WHERE data_registro = ?';
    const params = [req.body.dataRegistro];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao selecionar o custo.'});
        }

        res.json({ success: true, message: 'Custo selecionado com sucesso!', data: results[0] });
    });
}

exports.atualizarCusto = (req, res) => {
    const { idUsuario, valorEnergiaSemImpostos, valorEnergiaComImpostos, valorAguaSemImpostos, valorAguaComImpostos, dataRegistro } = req.body;
    const idCusto = req.params.idCusto;
    const params = [idUsuario, valorEnergiaSemImpostos, valorEnergiaComImpostos, valorAguaSemImpostos, valorAguaComImpostos, dataRegistro, idCusto];

    const query = 'UPDATE Custos SET id_usuario = ?, valor_energia_sem_impostos = ?, valor_energia_com_impostos = ?, valor_agua_sem_impostos = ?, valor_agua_com_impostos = ?, data_registro = ? WHERE id_custo = ?';
    
    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o custo.'});
        }

        res.json({ success: true, message: 'Custo atualizado com sucesso!'});
    });
}

exports.setUsuarioCusto = (req, res) => {
    const idUsuario = req.body.idUsuario;
    const idCusto = req.params.idCusto;
    const query = 'UPDATE Custos SET id_usuario = ? WHERE id_custo = ?';
    const params = [idUsuario, idCusto];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o usuário do custo.'});
        }
        res.json({ success: true, message: 'Usuário do custo atualizado com sucesso!'});
    });
}

exports.setEnergiaSemImpostoCusto = (req, res) => {
    const valorEnergiaSemImpostos = req.body.valorEnergiaSemImpostos;
    const idCusto = req.params.idCusto;
    const query = 'UPDATE Custos SET valor_energia_sem_impostos = ? WHERE id_custo = ?';
    const params = [valorEnergiaSemImpostos, idCusto];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o valor de energia sem impostos do custo.'});
        }
        res.json({ success: true, message: 'Valor de energia sem impostos do custo atualizado com sucesso!'});
    });
}

exports.setEnergiaComImpostoCusto = (req, res) => {
    const valorEnergiaComImpostos = req.body.valorEnergiaComImpostos;
    const idCusto = req.params.idCusto;
    const query = 'UPDATE Custos SET valor_energia_com_impostos = ? WHERE id_custo = ?';
    const params = [valorEnergiaComImpostos, idCusto];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o valor de energia com impostos do custo.'});
        }
        res.json({ success: true, message: 'Valor de energia com impostos do custo atualizado com sucesso!'});
    });
}

exports.setAguaSemImpostoCusto = (req, res) => {
    const valorAguaSemImpostos = req.body.valorAguaSemImpostos;
    const idCusto = req.params.idCusto;
    const query = 'UPDATE Custos SET valor_agua_sem_impostos = ? WHERE id_custo = ?';
    const params = [valorAguaSemImpostos, idCusto];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o valor de agua sem impostos do custo.'});
        }
        res.json({ success: true, message: 'Valor de agua sem impostos do custo atualizado com sucesso!'});
    });
}

exports.setAguaComImpostoCusto = (req, res) => {
    const valorAguaComImpostos = req.body.valorAguaComImpostos;
    const idCusto = req.params.idCusto;
    const query = 'UPDATE Custos SET valor_agua_com_impostos = ? WHERE id_custo = ?';
    const params = [valorAguaComImpostos, idCusto];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o valor de agua com impostos do custo.'});
        }
        res.json({ success: true, message: 'Valor de agua com impostos do custo atualizado com sucesso!'});
    });
}

exports.setDataCusto = (req, res) => {
    const dataRegistro = req.body.dataRegistro;
    const idCusto = req.params.idCusto;
    const query = 'UPDATE Custos SET data_registro = ? WHERE id_custo = ?';
    const params = [dataRegistro, idCusto];

    connection.query(query, params, (err, results) => {
        if (err || results.length == 0) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a data de registro do custo.'});
        }
        res.json({ success: true, message: 'Data de registro do custo atualizado com sucesso!'});
    });
}

exports.deletarCusto = (req, res) => {
    const query = 'DELETE FROM Custos WHERE id_custo = ?';
    const params = [req.params.idCusto];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao deletar o custo.'});
        }
        res.json({ success: true, message: 'Custo deletado com sucesso!'});
    });
}