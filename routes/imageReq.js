const router = require("express").Router();
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const auth = require("../middleware/auth");
const {
  getSignedUrl,
  S3RequestPresigner,
} = require("@aws-sdk/s3-request-presigner");

router.get("/:id", auth, async (req, res) => {
  const credentials = defaultProvider({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const options = {
    Bucket: "easytree",
    Key: `treeimages/${req.params.id}`,
  };

  const client = new S3Client({
    region: "us-central-1",
    credentials,
    endpoint: "https://s3.us-central-1.wasabisys.com",
  });

  //get a presigned link to the key from the bucket and send it to the client
  //if no image is found, send a 404 status

  try {
    const command = new GetObjectCommand(options);
    const response = await getSignedUrl(client, command, { expires: 3600 });
    console.log(response);
    res.status(200).send(response);
  } catch (err) {
    res.status(404).send("Image not found");
  }
});
module.exports = router;
