const router = require("express").Router();
const Joi = require("joi");
const { Tree, validate } = require("../models/trees");
const { Site } = require("../models/sites");
const auth = require("../middleware/auth");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

//get total amount of trees

router.get("/totalcount", async (req, res) => {
  const trees = await Tree.countDocuments();
  res.status(200).send({ data: trees, message: "Trees loaded" });
});

//get all trees in a site
router.get("/site/:id", async (req, res) => {
  const site = await Site.findById(req.params.id);
  if (!site) return res.status(404).send({ message: "Site not found" });
  //find trees by site properties trees array

  const trees = await Tree.find({ _id: { $in: site.properties.trees } });
  if (!trees) return res.status(404).send({ message: "No trees found" });

  console.log([...trees]);

  res.status(200).send({
    data: { type: "FeatureCollection", features: [...trees] },
    message: `Trees loaded for site ${site.properties.siteID}`,
  });
});

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
router.post("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  // console.log(req.body);

  //get site by id for adding trees
  const site = await Site.findById(req.params.id);
  if (!site) return res.status(404).send({ message: "Site not found" });

  //find tree data based on array of tree ids from site properties trees array
  const validTreeIds = site.properties.trees.filter((id) => id);
  const records = await Tree.find({ _id: { $in: validTreeIds } });

  //Check if any tree id already exists in records and add new tree using Tree.js from "../models/trees" if none exists. Making sure to set the treeID to the last value of treeID in the site list of trees + 1. If there are no trees in the site, set the treeID to 1.

  const existingTreeIds = records.map((record) => record.properties.treeID);
  const lastTreeId = Math.max(...existingTreeIds);
  const newTreeId = lastTreeId !== -Infinity ? lastTreeId + 1 : 1;

  if (existingTreeIds.includes(newTreeId)) {
    return res.status(400).send({ message: "Tree ID already exists" });
  }

  //use token to get user id and set lastModifiedBy to user's full name
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
  const user = await User.findById(decoded._id);
  if (!user) return res.status(404).send({ message: "User not found" });
  req.body.properties.createdBy = `${user.firstName} ${user.lastName}`;
  req.body.properties.treeID = newTreeId;
  req.body.properties.siteID = req.params.id;

  try {
    const newTree = await Tree(req.body).save();

    if (site.properties.trees === "") {
      site.properties.trees = [newTree._id];
    } else {
      site.properties.trees = [...site.properties.trees, newTree._id];
    }

    await site.save();

    res.status(201).send({ message: "Tree created", data: newTree });
  } catch (error) {
    return res.status(500).send({ message: "Failed to create tree" });
  }
});

//edit tree by id
router.put("/edit/:id", auth, async (req, res) => {
  const schema = Joi.object({
    properties: {
      treeID: Joi.number().required(),
      treeSpecies: Joi.string().required(),
      treeFamily: Joi.string().required(),
      status: Joi.string().required(),
      condition: Joi.string().required(),
      leafCondition: Joi.string().required(),
      comment: Joi.array().required(),
      lastModifiedDate: Joi.string().required(),
      lastModifiedBy: Joi.string().required(),
      lastWorkDate: Joi.string().required(),
      lastWorkedBy: Joi.string().required(),
      needsWork: Joi.boolean().required(),
      needsWorkComment: Joi.array().required(),
      dbh: Joi.number().required(),
      dateCreated: Joi.string().required(),
      createdBy: Joi.string().required(),
      isPlanted: Joi.boolean().required(),
      plantedBy: Joi.string().required(),
      datePlanted: Joi.string().required(),
      photos: Joi.array().required(),
      siteID: Joi.string().required(),
    },
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const tree = await Tree.findById(req.params.id);
  if (!tree) return res.status(404).send({ message: "Tree not found" });

  if (req.body.properties.needsWorkComment.length >= 1) {
    tree.properties.needsWork = true;
  } else if (req.body.properties.needsWorkComment.length === 0) {
    tree.properties.needsWork = false;
  }

  //use token to get user id and set lastModifiedBy to user's full name
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
  const user = await User.findById(decoded._id);
  if (!user) return res.status(404).send({ message: "User not found" });
  req.body.properties.lastModifiedBy = `${user.firstName} ${user.lastName}`;

  //update last modified date with current date and time in mm/dd/yyyy hh:mm:ss format in local time
  const date = new Date();

  req.body.properties.lastModifiedDate = date.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    hour12: true,
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  tree.properties.treeSpecies = req.body.properties.treeSpecies;
  tree.properties.treeFamily = req.body.properties.treeFamily;
  tree.properties.status = req.body.properties.status;
  tree.properties.condition = req.body.properties.condition;
  tree.properties.leafCondition = req.body.properties.leafCondition;
  tree.properties.comment = req.body.properties.comment;
  tree.properties.lastModifiedDate = req.body.properties.lastModifiedDate;
  tree.properties.lastModifiedBy = req.body.properties.lastModifiedBy;
  tree.properties.lastWorkDate = req.body.properties.lastWorkDate;
  tree.properties.lastWorkedBy = req.body.properties.lastWorkedBy;
  tree.properties.needsWorkComment = req.body.properties.needsWorkComment;
  tree.properties.dbh = req.body.properties.dbh;
  tree.properties.dateCreated = req.body.properties.dateCreated;
  tree.properties.createdBy = req.body.properties.createdBy;
  tree.properties.isPlanted = req.body.properties.isPlanted;
  tree.properties.plantedBy = req.body.properties.plantedBy;
  tree.properties.datePlanted = req.body.properties.datePlanted;
  tree.properties.photos = req.body.properties.photos;

  await tree.save();

  res.status(200).send({ message: "Updated Tree!", data: tree });
});

module.exports = router;
