const logger = require('../utils/logger').logger;
const config = require('../config/config.js');

const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
}

const setCreatedMeta = (object, user) => {
    object.createdBy = user;
    object.createdOn = Date.now();
    return object;
}

const setUpdatedMeta = (object, user) => {
    object.updatedBy = user;
    object.updatedOn = Date.now();
    return object;
}

module.exports = {
    getKeyByValue,
    setCreatedMeta,
    setUpdatedMeta
};