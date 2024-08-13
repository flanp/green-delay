const NotFoundError = require("../utils/errors/not-found-error");
const baseHelper = require('../helpers/baseHelper');

module.exports = {
  count,
  getAll,
  getById,
  create,
  update,
  delete: _delete
};

async function count(model, filters = {}) {
  return await model.countDocuments(filters);
}

async function getAll(
  model,
  filters = {},
  pageNumber = 0,
  pageSize = 20,
  sort = {},
  populate = ''
) {
  return await model
    .find(filters)
    .populate(populate)
    .limit(pageSize)
    .skip(pageNumber * pageSize)
    .sort(sort)
    .select("-hash");
}

async function getById(model, id) {
  return await model.findById(id);
}

async function create(model, values) {
  const record = new model(values);

  // save record
  await record.save();
}

async function update(model, id, values, sub) {
  // validate
  let record = await model.findById(id);
  if (!record) throw new NotFoundError("Não existe o registo procurado");

  Object.assign(record, values);

  if(sub) {
    record = baseHelper.setUpdatedMeta(record, sub);
  }

  // save record
  await record.save();
}

async function _delete(model, id) {
  await model.findByIdAndRemove(id);
}
