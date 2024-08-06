const config = require('../config/config.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../utils/db-helper');
const User = db.User;
const ConflictError = require('../utils/errors/conflict-error');
const AlreadyExistsError = require('../utils/errors/already-exists-error');
const constants = require('../utils/constants');
const uuid = require('uuid-random');
const baseService = require('./base.service');
const baseHelper = require('../helpers/baseHelper');
const NotFoundError = require('../utils/errors/not-found-error.js');
const logger = require('../utils/logger').logger;

module.exports = {
  count: filters => baseService.count(User, filters),
  getAll: (filters, pageNumber, pageSize) =>
    baseService.getAll(User, filters, pageNumber, pageSize),
  authenticate,
  saveIp,
  refreshToken,
  register,
  edit,
  delete: _delete,
  changePassword,
  isActive
};

async function authenticate({ username, password }) {
  logger.debug(`>>> user.service - Enter authenticate`)
  const user = await User.findOne({ username });
  if(user && user.hash && bcrypt.compareSync(password, user.hash)) {
      const { hash, ips, ...userWithoutHash } = user.toObject();
      const tokenObj = {
        sub: user.id,
        iss: 'green-delay-server',
        role: user.role
      };

      if (user.role === 'U') {
        tokenObj.exp = Math.floor(Date.now() / 1000) + (60 * 60 * 4); // 4h
      }
      const token = jwt.sign(tokenObj, config.secret, {});

      const refreshToken = uuid();

      user.refreshToken = refreshToken;
      user.lastLogin = Date.now();
      await user.save();

      logger.debug(`>>> user.service - Exit authenticate - id: ${user.id}`);

      return {
          userWithoutHash,
          token,
          refreshToken
      };
  }

  throw new ConflictError('Username ou palavra-chave inválidos');
}

async function saveIp({ ip }, sub) {
  logger.debug(`>>> user.service - Enter saveIp - id: ${sub}`)
  let user = await User.findById(sub);
  if (!user) {
    throw new NotFoundError(
      'Algo não correu bem: '
    );
  }

  if (user.ips.find(x => x.ip === ip)) {
    user.ips.find(x => x.ip === ip).count++;
    user.ips.find(x => x.ip === ip).lastLogin = Date.now();
  } else {
    user.ips.push({ ip, count: 1, lastLogin: Date.now() });
  }

  await user.save();

  logger.debug(`>>> user.service - Exit saveIp - id: ${sub}`);
}

async function refreshToken({ refreshToken }) {
  logger.debug(`>>> user.service - Enter refreshToken - token: ${refreshToken}`);
  const user = await User.findOne({ refreshToken });

  if (user) {
    const { hash, ips, ...userWithoutHash } = user.toObject();
    const tokenObj = {
      sub: user.id,
      iss: 'green-delay-server',
      role: user.role
    };

    if (user.role === 'U') {
      tokenObj.exp = Math.floor(Date.now() / 1000) + (60 * 60 * 4); // 4h
    }
    const token = jwt.sign(tokenObj, config.secret, {});

    user.lastLogin = Date.now();
    await user.save();

    logger.debug(`>>> user.service - Exit refreshToken - token: ${refreshToken}, id: ${user.id}`)

    return {
      userWithoutHash,
      token
    };
  }
}

async function register(userParam, sub) {
  logger.debug(`>>> user.service - Enter register - sub: ${sub}`)
  // validate
  if (await User.findOne({ email: userParam.email })) {
    throw new AlreadyExistsError(
      'Já existe um utilizador com o email: ' + userParam.email
    );
  }

  let user = new User();
  user.name = userParam.name;
  user.username = userParam.username;
  user.email = userParam.email;
  user.role = userParam.role;
  user.hash = bcrypt.hashSync(userParam.password, 10);

  // TODO should add renewal date?

  user = baseHelper.setCreatedMeta(user, sub);

  // save user
  await user.save();

  logger.debug(`>>> user.service - Exit register - sub: ${sub}`)
}

async function edit(userParam, sub) {
  logger.debug(`>>> user.service - Enter edit - sub: ${sub}`)
  // validate
  let user = await User.findOne({ email: userParam.email });
  if (!user) {
    throw new NotFoundError(
      'Não existe nenhum utilizador com o email: ' + userParam.email
    );
  }

  user.name = userParam.name;
  user.username = userParam.username;
  user.email = userParam.email;
  user.role = userParam.role;
  user.renewalDate = userParam.renewalDate;
  user.isActive = userParam.isActive;

  user = baseHelper.setUpdatedMeta(user, sub);

  // save user
  await user.save();

  logger.debug(`>>> user.service - Exit edit - sub: ${sub}`)
}

async function _delete(id) {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new NotFoundError('Não existe o utilizador procurado');
}

async function changePassword({ oldPassword, newPassword, newPasswordConfirmation }, sub) {
  logger.debug(`>>> user.service - Enter changePassword - id: ${sub}`);
  let user = await User.findById(sub);

  if (!user) throw new NotFoundError('Não existe o utilizador procurado');

  if (!bcrypt.compareSync(oldPassword, user.hash)) throw new ConflictError('A palavras-passe antiga não está correta');

  if (newPassword !== newPasswordConfirmation) throw new ConflictError('As palavras-passes não são iguais');

  user.hash = bcrypt.hashSync(newPassword, 10);
  user = baseHelper.setUpdatedMeta(user, sub);

  // save user
  await user.save();

  logger.debug(`>>> user.service - Exit changePassword - id: ${sub}`)

  return;
}

async function isActive(sub) {
  logger.debug(`>>> user.service - Enter isActive - id: ${sub}`);
  let user = await User.findById(sub);

  if (!user) return null;

  logger.debug(`>>> user.service - Exit isActive - id: ${sub}`);
  return user.isActive;
}