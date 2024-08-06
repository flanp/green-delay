const config = require('../config/config.js');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const logger = require('./logger').logger;

mongoose.connect(process.env.MONGODB_URI || config.connectionString, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .catch(err => logger.error('Error initialising database: ' + err));

mongoose.connection.on('error', err => logger.error(('Error connecting to database: ' + err)));

mongoose.Promise = global.Promise;

autoIncrement.initialize(mongoose.connection);

module.exports = {
    User: require('../db/models/user.model'),
    Stream: require('../db/models/stream.model')
};