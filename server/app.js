const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const porta = 3000;
app.listen(porta, () => console.log(`Servidor rodando na porta ${porta}`));

// const rotas = ['atividades', 'consumosAgua', 'consumosEnergia', 'custos', 'eletrodomesticos', 'metas', 'notificacoes', 'residencias', 'tarifas', 'usuarios'];
const rotas = ['atividades', 'usuarios'];
rotas.forEach((rota) => app.use(require(`./routes/${rota}Routes`)));