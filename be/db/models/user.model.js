const mongoose = require('mongoose');
const schema = require('../schemas/user.schema');
const constants = require('../../utils/constants');

module.exports = mongoose.model(constants.dbModels.user, schema);