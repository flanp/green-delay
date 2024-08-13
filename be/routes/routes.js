const define = (app) => {
    app.use('/main', require('./controllers/main.controller'));
    app.use('/user', require('./controllers/user.controller'));
    app.use('/stream', require('./controllers/stream.controller'));
    app.use('/session', require('./controllers/session.controller'));
};

module.exports = {
    define: define
};