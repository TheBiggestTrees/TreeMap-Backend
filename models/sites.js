const mongoose = require("mongoose");
const joi = require("joi");

const siteSchema = new mongoose.Schema({
  type: { type: String, enum: ["Feature"], required: true },
  geometry: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: Array, required: true },
  },
  properties: {
    siteID: { type: Number, required: true },
    trees: { type: [String], default: [] },
  },
});

const validate = (site) => {
  const schema = joi.object({
    type: joi.string().default("Feature"),
    geometry: {
      type: joi.string().default("Point"),
      coordinates: joi.array().required(),
    },
    properties: {
      siteID: joi.number().required(),
      trees: joi.string().default([""]),
    },
  });
  return schema.validate(site);
};

const Site = mongoose.model("site", siteSchema);

module.exports = { Site, validate };
