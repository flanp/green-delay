const express = require('express');
const router = express.Router();
const streamService = require('../../services/stream.service');
const authorize = require('../../utils/authorize');
const roles = require('../../utils/constants').roles;
const { body, param } = require('express-validator');
const validateErrors = require('../../utils/errors/validate-errors').validate;
const paginationHelper = require('../../helpers/paginationHelper');

// routes
router.get('/', authorize([roles.A, roles.W, roles.U]), validateErrors, list);

router.get(
  '/:id',
  authorize([roles.A, roles.W, roles.U]),
  validateErrors,
  getById
);

router.get(
  '/:id/status',
  authorize([roles.A, roles.W, roles.U]),
  validateErrors,
  getStatus
);

// router.put(
//   '/:id/subscriber',
//   authorize([roles.A, roles.W, roles.U]),
//   validateErrors,
//   addSubscriber
// );

// router.delete(
//   '/:id/subscriber/:subscriberId',
//   authorize([roles.A, roles.W, roles.U]),
//   validateErrors,
//   removeSubscriber
// );

router.post(
  '/register',
  validate('register'),
  validateErrors,
  authorize([roles.A, roles.W]),
  register
);

router.put(
  '/:id',
  // validate('edit'),
  validateErrors,
  authorize([roles.A, roles.W]),
  edit
);

router.delete(
  '/:id',
  authorize([roles.A, roles.W]),
  validate('delete'),
  validateErrors,
  _delete
);

router.put(
  '/:id/statsLink',
  authorize([roles.A, roles.W]),
  validate('statsLink'),
  validateErrors,
  updateStatsLink
);

module.exports = router;

async function list(req, res, next) {
  try {
    const query = req.query;
    const filters = paginationHelper.getObjWithoutPaginationProps(query);

    const pagination = paginationHelper.getPaginationProps(query);

    const numberOfRecords = await streamService.count(filters);

    const filtered = await streamService.getAll(
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

function getById(req, res, next) {
  streamService
    .getById(req.params.id, req.user.sub)
    .then((stream) => res.json(stream))
    .catch((err) => next(err));
}

function getStatus(req, res, next) {
  streamService
    .getStatus(req.params.id, req.user.sub)
    .then((status) => res.json(status))
    .catch((err) => next(err));
}

function register(req, res, next) {
  streamService
    .register(req.body, req.user.sub)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function edit(req, res, next) {
  streamService
    .edit(req.body, req.user.sub)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

// function addSubscriber(req, res, next) {
//   streamService
//     .addSubscriber(req.params.id, req.body, req.user.sub)
//     .then(() => res.json({}))
//     .catch(err => next(err));
// }

// function removeSubscriber(req, res, next) {
//   streamService
//     .removeSubscriber(req.params.id, req.params.subscriberId, req.user.sub)
//     .then(() => res.json({}))
//     .catch(err => next(err));
// }

function _delete(req, res, next) {
  streamService
    .delete(req.params.id)
    .then(() => res.status(201).json())
    .catch((err) => next(err));
}

function updateStatsLink(req, res, next) {
  streamService
    .updateStatsLink(req.params.id, req.body, req.user.sub)
    .then(() => res.status(201).json())
    .catch((err) => next(err));
}

function validate(method) {
  switch (method) {
    case 'register': {
      return [
        body('title').exists().withMessage('Título obrigatório'),
        body('startDate').exists().withMessage('Data de início obrigatório'),
        body('category').exists().withMessage('Categoria obrigatória'),
      ];
    }
    case 'delete': {
      return [param('id').exists().withMessage('Id da stream obrigatório')];
    }
    case 'statsLink': {
      return [
        param('id')
          .exists({ checkFalsy: true, checkNull: true })
          .withMessage('Id da stream obrigatório')
          .isMongoId()
          .withMessage('Id da stream inválido'),
        body('statsLink').exists().withMessage('Link obrigatório'),
      ];
    }
  }
}
