const mongoose = require("mongoose");
const joi = require("joi");

const treeSchema = new mongoose.Schema({
  type: { type: String, enum: ["Feature"], required: true },
  geometry: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: Array, required: true },
  },
  properties: {
    treeID: { type: Number, required: true },
    treeSpecies: { type: String, required: true },
    siteID: { type: String, required: true },
    needsWork: { type: Boolean, required: true },
    datePlanted: { type: String, required: true },
    lastWorkDate: { type: String, required: true },
  },
});

const validate = (tree) => {
  const schema = joi.object({
    type: joi.string().default("Feature"),
    geometry: {
      type: joi.string().default("Point"),
      coordinates: joi.array().required(),
    },
    properties: {
      treeID: joi.number().required(),
      treeSpecies: joi.string().required(),
      siteID: joi.string().required(),
      needsWork: joi.boolean().required(),
      datePlanted: joi.string().required(),
      lastWorkDate: joi.string().required(),
    },
  });
  return schema.validate(tree);
};

const Tree = mongoose.model("tree", treeSchema);

module.exports = { Tree, validate };
