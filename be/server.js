require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./utils/logger').logger;
const config = require('./config/config');
const errorHandler = require('./utils/error-handler');
const insertAdminUser = require('./db/init/admin-user').insertAdminUser;

insertAdminUser();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());

const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
    //intercept OPTIONS method
    if ('OPTIONS' == req.method) {
            res.send(200);
    } else {
            next();
    }
}
app.use(allowCrossDomain);

// api routes
const apiRoutes = require('./routes/routes');
apiRoutes.define(app);

// global error handler
app.use(errorHandler);

// start server
const port = parseInt(config.port, 10);
if (isNaN(port) || port < 0 || port >= 65536) {
    throw new RangeError(`Porta inválida: ${config.port}`);
}

const server = app.listen(port, async function () {
    logger.info('Server listening on port ' + port);
});