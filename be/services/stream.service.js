const baseService = require('./base.service');
const baseHelper = require('../helpers/baseHelper');
const { Stream, User } = require('../utils/db-helper');
const NotFoundError = require('../utils/errors/not-found-error.js');
const logger = require('../utils/logger').logger;
const openViduService = require('./openvidu.service');

module.exports = {
  count: (filters) => baseService.count(Stream, filters),
  getAll: (filters, pageNumber, pageSize) =>
    baseService.getAll(Stream, filters, pageNumber, pageSize, { startDate: 1 }),
  getById: (id) => baseService.getById(Stream, id),
  getStatus,
  register,
  edit,
  addSubscriber,
  removeSubscriber,
  delete: _delete,
  updateStatsLink,
};

async function getStatus(streamId, sub) {
  logger.debug(`>>> stream.service - Enter get status - sub: ${sub}`);

  if (!(await Stream.findById(streamId))) {
    throw new NotFoundError('A stream não existe');
  }

  logger.debug(`>>> stream.service - Exit get status - sub: ${sub}`);
  return openViduService.getSessionInfo(streamId);
}

async function register(streamParam, sub) {
  logger.debug(`>>> stream.service - Enter register - sub: ${sub}`);  

  const user = await User.findById(sub);
  if (!user) {
    throw new NotFoundError('O utilizador não existe');
  }

  let stream = new Stream();
  stream.title = streamParam.title;
  stream.startDate = streamParam.startDate;
  stream.publisherId = sub;
  stream.publisherName = user.username;
  stream.subscriberIds = [];
  stream.isActive = false;
  stream.category = streamParam.category;
  stream.rating = streamParam.rating;

  stream = baseHelper.setCreatedMeta(stream, sub);

  // save user
  await stream.save();

  logger.debug(`>>> stream.service - Exit register - sub: ${sub}`);
}

async function edit(streamParam, sub) {
  logger.debug(`>>> stream.service - Enter edit - sub: ${sub}`);

  const user = await User.findById(sub);
  if (!user) {
    throw new NotFoundError('O utilizador não existe');
  }

  let stream = await Stream.findById(streamParam.id);
  if (!stream) {
    throw new NotFoundError('A stream não existe');
  }

  stream.title = streamParam.title;
  stream.startDate = streamParam.startDate;
  stream.publisherId = sub;
  stream.publisherName = user.username;
  stream.isActive = streamParam.isActive;
  stream.category = streamParam.category;
  stream.rating = streamParam.rating;

  stream = baseHelper.setUpdatedMeta(stream, sub);

  // save user
  await stream.save();

  logger.debug(`>>> stream.service - Exit edit - sub: ${sub}`);
}

async function addSubscriber(id, streamParam, sub) {
  logger.debug(`>>> stream.service - Enter addSubscriber - sub: ${sub}`);

  const stream = await Stream.findById(id);

  stream.subscriberIds.push(streamParam.subscriberId);

  await stream.save();

  logger.debug(`>>> stream.service - Exit addSubscriber - sub: ${sub}`);
}

async function removeSubscriber(id, subscriberId, sub) {
  logger.debug(`>>> stream.service - Enter removeSubscriber - sub: ${sub}`);

  const stream = await Stream.findById(id);

  stream.subscriberIds = stream.subscriberIds.filter((x) => x !== subscriberId);

  await stream.save();

  logger.debug(`>>> stream.service - Exit removeSubscriber - sub: ${sub}`);
}

async function _delete(id) {
  let stream = await Stream.findByIdAndDelete(id);
  if (!stream) throw new NotFoundError('Não existe a stream procurada');
}

async function updateStatsLink(id, { statsLink }, sub) {
  logger.debug(`>>> stream.service - Enter updateStatsLink - sub: ${sub}`);
  let stream = await Stream.findById(id);
  if (!stream) {
    throw new NotFoundError('A stream não existe');
  }

  stream.statsLink = statsLink;
  stream = baseHelper.setUpdatedMeta(stream, sub);
  stream = await stream.save();

  logger.debug(`>>> stream.service - Exit updateStatsLink - sub: ${sub}`);
  return stream;
}
