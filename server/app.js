const express = require("express");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const options = {
  swaggerOptions: {
    docExpansion: 'none'
  }
};

const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

const porta = 3000;
app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
    console.log(`Documentação disponível em http://localhost:${porta}/api-docs`);
});

const rotas = ['atividades', 'consumosAgua', 'consumosEnergia', 'custos', 'eletrodomesticos', 'metas', 'notificacoes', 'residencias', 'tarifas', 'usuarios', 'nodemailer'];
rotas.forEach((rota) => app.use(require(`./routes/${rota}Routes`)));