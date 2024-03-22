const router = require("express").Router();
const Joi = require("joi");
const validObjectId = require("../middleware/validObjectId");
const { Tree, validate } = require("../models/trees");
const { Site } = require("../models/sites");
const { ObjectId } = require("mongodb");

//get all trees
router.get("/", async (req, res) => {
  const trees = await Tree.find();
  res.status(200).send({
    data: { type: "FeatureCollection", features: [...trees] },
    message: "Trees loaded",
  });
});

//get tree by id
router.get("/:id", async (req, res) => {
  const tree = await Tree.findById(req.params.id);
  res
    .status(200)
    .send({ data: tree, message: `Tree ${tree.properties.treeID}` });
});

//create tree
router.post("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  // console.log(req.body);

  //get site by id for adding trees
  const site = await Site.findById(req.params.id);
  if (!site) return res.status(404).send({ message: "Site not found" });

  //find tree data based on array of tree ids from site properties trees array
  const validTreeIds = site.properties.trees.filter(id => id);
  const records = await Tree.find({ _id: { $in: validTreeIds } });

  //Check if any tree id already exists in records and add new tree using Tree.js from "../models/trees" if none exists. Making sure to set the treeID to the last value of treeID in the site list of trees + 1. If there are no trees in the site, set the treeID to 1.

  const existingTreeIds = records.map((record) => record.properties.treeID);   
  const lastTreeId = Math.max(...existingTreeIds);
  const newTreeId = lastTreeId !== -Infinity ? lastTreeId + 1 : 1;

  if (existingTreeIds.includes(newTreeId)) {
    return res.status(400).send({ message: "Tree ID already exists" });
  }

  req.body.properties.treeID = newTreeId;
  req.body.properties.siteID = req.params.id;

  try {
    const newTree = await Tree(req.body).save();

    if (site.properties.trees === "") {
      site.properties.trees = [newTree._id];
    } else {site.properties.trees = [...site.properties.trees, newTree._id];}
  
    await site.save();

    res.status(201).send({ message: "Tree created", data: newTree });
  } catch (error) {
    return res.status(500).send({ message: "Failed to create tree" });
  }


});

//edit tree by id
router.put("/edit/:id", async (req, res) => {
  const schema = Joi.object({
    properties: {
      needsWork: Joi.string().required(),
    },
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const tree = await Tree.findById(req.params.id);
  if (!tree) return res.status(404).send({ message: "Tree not found" });

  tree.properties.needsWork = req.body.properties.needsWork;
  await tree.save();

  res.status(200).send({ message: "Updated Tree!" });
});

module.exports = router;
