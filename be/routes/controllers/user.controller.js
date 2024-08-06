const express = require('express');
const router = express.Router();
const userService = require('../../services/user.service');
const authorize = require('../../utils/authorize');
const roles = require('../../utils/constants').roles;
const { body, param } = require('express-validator');
const validateErrors = require('../../utils/errors/validate-errors').validate;
const paginationHelper = require('../../helpers/paginationHelper');
const constants = require('../../utils/constants');

// routes
router.get('/', authorize([roles.A]), validateErrors, list);

router.post(
  '/authenticate',
  validate('authenticate'),
  validateErrors,
  authenticate
);

router.put(
  '/ip',
  authorize([roles.A, roles.W, roles.U]),
  validate('ip'),
  validateErrors,
  saveIp
);

router.post(
  '/refresh-token',
  validate('refreshToken'),
  validateErrors,
  refreshToken
);

router.post(
  '/register',
  authorize([roles.A]),
  validate('register'),
  validateErrors,
  register
);

router.put('', authorize([roles.A]), validate('edit'), validateErrors, edit);

router.delete(
  '/:id',
  authorize([roles.A]),
  validate('delete'),
  validateErrors,
  _delete
);

router.get(
  '/current',
  authorize([roles.A, roles.W, roles.U]),
  validateErrors,
  getCurrent
);

router.put(
  '/change-password',
  authorize([roles.A, roles.W, roles.U]),
  validate('change-password'),
  validateErrors,
  changePassword
);

router.get(
  '/active',
  authorize([roles.A, roles.W, roles.U]),
  validateErrors,
  isActive
);

module.exports = router;

async function list(req, res, next) {
  try {
    const query = req.query;
    const filters = paginationHelper.getObjWithoutPaginationProps(query);

    if (filters.hasOwnProperty('email')) {
      filters['email'] = new RegExp(filters['email'], 'i');
    }

    if (filters.hasOwnProperty('username')) {
      filters['username'] = new RegExp(filters['username'], 'i');
    }

    if (filters.hasOwnProperty('name')) {
      filters['name'] = new RegExp(filters['name'], 'i');
    }

    if (filters.hasOwnProperty('ip')) {
      filters['ips.ip'] = new RegExp(filters['ip'], 'i');
      delete filters['ip'];
    }

    const pagination = paginationHelper.getPaginationProps(query);

    const numberOfRecords = await userService.count(filters);

    const filtered = await userService.getAll(
      filters,
      pagination.pageNumber,
      pagination.pageSize
    );

    res.json({
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
      numberOfRecords,
      data: filtered,
      hasNext:
        numberOfRecords > pagination.pageNumber + 1 * pagination.pageSize,
    });
  } catch (err) {
    next(err);
  }
}

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then((user) => res.json(user))
    .catch((err) => next(err));
}

function saveIp(req, res, next) {
  userService
    .saveIp(req.body, req.user.sub)
    .then((_) => res.json({}))
    .catch((err) => next(err));
}

function refreshToken(req, res, next) {
  userService
    .refreshToken(req.body)
    .then((user) =>
      user
        ? res.json(user)
        : res.status(401).json({ message: 'A sua sessão expirou' })
    )
    .catch((err) => next(err));
}

function register(req, res, next) {
  userService
    .register(req.body, req.user.sub)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function edit(req, res, next) {
  userService
    .edit(req.body, req.user.sub)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id, req.body, req.user.sub)
    .then(() => res.status(201).json())
    .catch((err) => next(err));
}

function getCurrent(req, res, next) {
  userService
    .getById(req.user.sub)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function changePassword(req, res, next) {
  userService
    .changePassword(req.body, req.user.sub)
    .then((_) => res.status(201).json())
    .catch((err) => next(err));
}

function isActive(req, res, next) {
  userService
    .isActive(req.user.sub)
    .then((isActive) =>
      isActive != null
        ? res.json({ isActive, exists: true })
        : res.json({ isActive, exists: false })
    )
    .catch((err) => next(err));
}

function validate(method) {
  switch (method) {
    case 'authenticate': {
      return [
        body('username').exists().withMessage('Username obrigatório'),
        body('password')
          .exists()
          .withMessage('Password obrigatória')
          .isLength({ min: 5, max: 16 })
          .withMessage('Password deve ter entre 5 e 16 caracteres'),
      ];
    }
    case 'ip': {
      return [body('ip').exists().withMessage('Ip obrigatório')];
    }
    case 'refreshToken': {
      return [
        body('refreshToken')
          .exists({ checkFalsy: true })
          .withMessage('Refresh token é obrigatório'),
      ];
    }
    case 'register': {
      return [
        body('email')
          .exists()
          .withMessage('Email obrigatório')
          .isEmail()
          .withMessage('Email inválido'),
        body('role')
          .exists()
          .withMessage('Role obrigatório')
          .isIn(Object.keys(constants.roles))
          .withMessage('Role inválido'),
        body('name')
          .exists({ checkFalsy: true })
          .withMessage('Nome obrigatório'),
        body('username')
          .exists({ checkFalsy: true })
          .withMessage('Nome de utilizador obrigatório'),
        body('password')
          .exists({ checkFalsy: true })
          .withMessage('Password obrigatório'),
      ];
    }
    case 'edit': {
      return [
        body('email')
          .exists()
          .withMessage('Email obrigatório')
          .isEmail()
          .withMessage('Email inválido'),
        body('role')
          .exists()
          .withMessage('Role obrigatório')
          .isIn(Object.keys(constants.roles))
          .withMessage('Role inválido'),
        body('name')
          .exists({ checkFalsy: true })
          .withMessage('Nome obrigatório'),
        body('username')
          .exists({ checkFalsy: true })
          .withMessage('Nome de utilizador obrigatório'),
      ];
    }
    case 'delete': {
      return [param('id').exists().withMessage('Id do utilizador obrigatório')];
    }
    case 'change-password': {
      return [
        body('oldPassword')
          .exists()
          .withMessage('A palavra-passe antiga é obrigatória'),
        body('newPassword')
          .exists()
          .withMessage('A palavra-passe nova é obrigatória')
          .isLength({ min: 5, max: 16 })
          .withMessage('Password deve ter entre 5 e 16 caracteres'),
        body('newPasswordConfirmation')
          .exists()
          .withMessage('A confirmação da palavra-passe nova é obrigatória'),
      ];
    }
  }
}
