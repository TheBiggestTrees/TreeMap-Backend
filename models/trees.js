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
    treeFamily: { type: String, required: true },
    status: { type: String, required: true },
    condition: { type: String, required: true },
    leafCondition: { type: String, required: true },
    comment: { type: Array, required: false },
    lastModifiedDate: { type: String, required: true },
    lastModifiedBy: { type: String, required: true },
    lastWorkDate: { type: String, required: true },
    lastWorkedBy: { type: String, required: true },
    needsWork: { type: Boolean, required: true },
    needsWorkComment: { type: Array, required: false },
    dbh: { type: Number, required: true },
    dateCreated: { type: String, required: true },
    createdBy: { type: String, required: true },
    isPlanted: { type: Boolean, required: true },
    plantedBy: { type: String, required: true },
    datePlanted: { type: String, required: true },
    photos: { type: Array, required: false },
    siteID: { type: String, required: true },
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
      treeFamily: joi.string().required(),
      status: joi.string().required(),
      condition: joi.string().required(),
      leafCondition: joi.string().required(),
      comment: joi.array(),
      lastModifiedDate: joi.string().required(),
      lastModifiedBy: joi.string().required(),
      lastWorkDate: joi.string().required(),
      lastWorkedBy: joi.string().required(),
      needsWork: joi.boolean().required(),
      needsWorkComment: joi.array(),
      dbh: joi.number().required(),
      dateCreated: joi.string().required(),
      createdBy: joi.string().required(),
      isPlanted: joi.boolean().required(),
      plantedBy: joi.string().required(),
      datePlanted: joi.string().required(),
      photos: joi.array(),
      siteID: joi.string().required(),
    },
  });
  return schema.validate(tree);
};

const Tree = mongoose.model("tree", treeSchema);

module.exports = { Tree, validate };
