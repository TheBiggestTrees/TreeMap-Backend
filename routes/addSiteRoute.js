const router = require("express").Router();
const Joi = require("joi");
const { Site, validate } = require("../models/sites");
const { Tree } = require("../models/trees");
//get all sites
router.get("/", async (req, res) => {
  const sites = await Site.find();
  res.status(200).send({
    data: { type: "FeatureCollection", features: [...sites] },
    message: "Sites loaded",
  });
});

//get all trees by _id by site _id
router.get("/trees/:id", async (req, res) => {
  try {
    const sites = await Site.findById(req.params.id);
    if (!sites) return res.status(404).send({ message: "Site not found" });

    const validTreeIds = sites.properties.trees.filter(id => id);
    const records = await Tree.find({ _id: { $in: validTreeIds } });

    console.log(records)
    if (!records) return res.status(404).send({message: `No trees found for site ${sites.properties.siteID}`});

    return res.status(200).send({
      data: { trees: [...records] },
      message: `Showing trees for site ${sites.properties.siteID}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred on the server.' });
  }
});

//create site
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  //increment siteID
  const lastSite = await Site.find().sort({'_id':-1}).limit(1);
  if (lastSite.length === 0) {
    req.body.properties.siteID = 1;
  } else {
    req.body.properties.siteID = lastSite[0].properties.siteID + 1;
  }
  
  const site = await Site(req.body).save();
  res.status(201).send({ data: site, message: "Site added successfully" });
});

//edit site by id
router.put("/:id", async (req, res) => {
  const schema = Joi.object({
    properties: {
      trees: Joi.string().required(),
    },
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const site = await Site.findById(req.params.id);
  if (!site) return res.status(404).send({ message: "Site not found" });

  if (!site.properties.trees.includes(req.body.properties.trees)) {
    site.properties.trees = [
      ...site.properties.trees,
      req.body.properties.trees,
    ];
    site.save();
  } else {
    return res.status(400).send({ data: site, message: "Could not add tree" });
  }
});

module.exports = router;
