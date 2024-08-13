const config = require('../config/config.js');
const allRoles = require('./constants').roles;
const jwt = require('jsonwebtoken');

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User')
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if(typeof roles === 'string') {
        roles = [roles];
    }

    const translateRolesForKeys = [];

    Object.keys(allRoles).forEach(roleKey => {
        if (roles.includes(allRoles[roleKey])) {
            translateRolesForKeys.push(roleKey);
        }
    });

    const secret = config.secret;
    return [
        (req, res, next) => {
            const authHeader = req.headers.authorization;
            if(authHeader) {
                const token = authHeader.split(' ')[1];
                jwt.verify(token, secret, (err, user) => {
                    if(err) {
                        return res.status(401).json({ message: 'Autenticação inválida' });
                    }
                    req.user = user;
                    next();
                });
            } else if (roles.includes(allRoles.Anonymous)) {
                return next();
            } else {
                return res.status(401).json({ message: 'Autenticação inválida' });
            }
        },
        (req, res, next) => {
            if(roles.includes(allRoles.Anonymous)) {
                return next();
            }
            // Super Admins can do anything
            if(req.user.role !== 'SA' && !translateRolesForKeys.includes(req.user.role)) {
                // user's role is not authorized
                // TODO this should be 403?
                return res.status(401).json({ message: 'Autorização inválida' });
            }

            // authentication and authorization successful
            next();
        }
    ]
}