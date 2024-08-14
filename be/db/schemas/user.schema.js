const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../../utils/constants");

const schema = new Schema({
    email: { type: String, unique: true, required: true },
    group: { type: String },
    name: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    hash: { type: String },
    role: { type: String, required: true, enum: Object.keys(constants.roles) },
    refreshToken: { type: String },
    lastLogin: { type: Date },
    renewalDate: { type: Date },
    ips: [{ ip: String, count: Number, lastLogin: Date, _id: false }],
    isActive: { type: Boolean, required: true, default: true },

    createdOn: { type: Date, required: true, default: Date.now },
    createdBy: { type: String },
    updatedOn: { type: Date, default: Date.now },
    updatedBy: { type: String }
});

schema.set("toJSON", { virtuals: true });

module.exports = schema;