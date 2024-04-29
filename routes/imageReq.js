const router = require("express").Router();
const AWS = require("aws-sdk");

//get image from s3 bucket based on request body
//setup aws s3 for image retrieval

router.get("/:id", async (req, res) => {
  const credentials = {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  };

  const options = {
    keyPrefix: "treeimages/",
    bucket: "easytree",
    region: "us-central-1",
    successActionStatus: 201,
    key: req.params.id,
  };

  AWS.config.credentials = credentials;
  AWS.config.region = options.region;

  const ep = new AWS.Endpoint("s3.us-central-1.wasabisys.com");
  const s3 = new AWS.S3({ endpoint: ep });

  s3.getObject(options, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).send({ message: "Image not found" });
    }
    res.status(200).send(data.Body);
  });
});
