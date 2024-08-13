const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constants = require('../../utils/constants');

const schema = new Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  publisherId: { type: String },
  publisherUsername: { type: String },
  subscriberIds: [{ type: String }],
  isActive: { type: Boolean, required: true, default: false },
  category: {
    type: String,
    required: true,
    enum: Object.keys(constants.streamCategories),
  },
  rating: {
    type: String,
    required: true,
    enum: Object.keys(constants.streamRatings),
  },
  statsLink: {
    type: String,
    default: null,
  },

  createdOn: { type: Date, required: true, default: Date.now },
  createdBy: { type: String },
  updatedOn: { type: Date, default: Date.now },
  updatedBy: { type: String },
});

schema.set('toJSON', { virtuals: true });

module.exports = schema;
