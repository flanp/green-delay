require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./utils/logger').logger;
const config = require('./config/config');
const errorHandler = require('./utils/error-handler');
const mongoose = require('mongoose');

// Configurar e conectar ao MongoDB
const mongoURI = 'mongodb://root:pass@mongo:27017/GreenDelay?authSource=admin';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,  // Tempo máximo para encontrar o MongoDB
    socketTimeoutMS: 45000,  // Tempo máximo para as operações
})
.then(() => {
    logger.info('Conectado ao MongoDB');

    // Carregar dados iniciais após a conexão
    const insertAdminUser = require('./db/init/admin-user').insertAdminUser;
    insertAdminUser();

    // Configurar middlewares
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(allowCrossDomain);

    // Definir rotas da API
    const apiRoutes = require('./routes/routes');
    apiRoutes.define(app);

    // Global error handler
    app.use(errorHandler);

    // Iniciar o servidor Express após a conexão bem-sucedida ao MongoDB
    const port = parseInt(config.port, 10);
    if (isNaN(port) || port < 0 || port >= 65536) {
        throw new RangeError(`Porta inválida: ${config.port}`);
    }

    const server = app.listen(port, function () {
        logger.info('Server listening on port ' + port);
    });
})
.catch(err => {
    logger.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);  // Encerrar o processo se a conexão falhar
});

// Função de configuração de CORS
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
};
