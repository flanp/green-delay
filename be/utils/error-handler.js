const logger = require('../utils/logger').logger;

function errorHandler(err, req, res, next) {
    if(typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ message: err });
    }

    if(err.name === 'ValidationError') {
        // mongoose validation error
        logger.warn(err.stack || err.message || 'Erro de validação na BD');
        return res.status(400).json({ message: err.message }); 
    }

    if(err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: 'Autenticação inválida' });
    }

    if(err.name === 'ForbiddenError') {
        // forbidden error
        return res.status(403).json({ message: err.message });
    }

    if(err.name === 'NotFoundError') {
        // forbidden error
        return res.status(404).json({ message: err.message });
    }

    if(err.name === 'AlreadyExistsError') {
        // forbidden error
        logger.info(err.stack || err.message || 'Tentativa de duplicação de dados');
        return res.status(409).json({ message: err.message });
    }

    if(err.name === 'ConflictError') {
        // forbidden error
        logger.info(err.stack || err.message);
        return res.status(409).json({ message: err.message });
    }

    logger.error(err.stack || err.message || 'Erro desconhecido');

    // default to 500 server error
    return res.status(500).json({ message: err.message });
}

module.exports = errorHandler;