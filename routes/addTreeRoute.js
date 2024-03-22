const router = require("express").Router();
const Joi = require("joi");
const validObjectId = require("../middleware/validObjectId");
const { Tree, validate } = require("../models/trees");
const { Site } = require("../models/sites");

//get all trees
router.get("/", async (req, res) => {
  const trees = await Tree.find();
  res
    .status(200)
    .send({
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
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  console.log(req.body);

  const tree = await Tree(req.body).save();
  res.status(201).send({ data: tree, message: "Tree added successfully" });
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
