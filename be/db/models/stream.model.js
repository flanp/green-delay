const mongoose = require('mongoose');
const schema = require('../schemas/stream.schema');
const constants = require('../../utils/constants');

module.exports = mongoose.model(constants.dbModels.stream, schema);