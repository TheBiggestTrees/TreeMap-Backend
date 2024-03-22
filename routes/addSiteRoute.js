const router = require("express").Router();
const { Site, validate } = require("../models/sites");
const { Tree } = require("../models/trees");
//get all sites
router.get("/", async (req, res) => {
  const sites = await Site.find();
  res.status(200).send({ data: sites, message: "Trees loaded" });
});

//get all trees by _id by site _id
router.get("/trees/:id", async (req, res) => {
  const sites = await Site.findById(req.params.id);
  const records = await Tree.find(sites.data);

  res.status(200).send({
    data: { type: "FeatureCollection", features: [...records] },
    message: `Showing trees for site ${sites.properties.siteID}`,
  });
});

//create site
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const site = await Site(req.body).save();
  res.status(201).send({ data: site, message: "Site added successfully" });
});

module.exports = router;
