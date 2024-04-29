const router = require("express").Router();
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const auth = require("../middleware/auth");

router.get("/:id", auth, async (req, res) => {
  const credentials = defaultProvider({
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  });

  const options = {
    Bucket: "easytree",
    Key: `treeimages/${req.params.id}`,
  };

  const client = new S3Client({
    region: "us-central-1",
    credentials,
    endpoint: "s3.us-central-1.wasabisys.com",
  });

  try {
    const data = await client.send(new GetObjectCommand(options));
    const body = await new Promise((resolve, reject) => {
      let body = "";
      data.Body.on("data", (chunk) => (body += chunk));
      data.Body.on("error", reject);
      data.Body.on("end", () => resolve(body));
    });
    res.status(200).send(body);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Image not found" });
  }
});
module.exports = router;
