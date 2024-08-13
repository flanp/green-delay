const { validationResult } = require('express-validator');
const logger = require('../logger').logger;

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        return next();
    }

    logger.info('Bad request - validação de inputs: ' + errors.array().map(err => JSON.stringify(err)));
    return res.status(400).json({ errors: errors.array() });
};

module.exports = {
    validate
};