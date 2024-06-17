const router = require("express").Router();
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const auth = require("../middleware/auth");
const {
  getSignedUrl,
  S3RequestPresigner,
} = require("@aws-sdk/s3-request-presigner");
const { Upload } = require("@aws-sdk/lib-storage");

router.get("/:id", auth, async (req, res) => {
  const credentials = defaultProvider({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const options = {
    Bucket: "treemap",
    Key: `treeimages/${req.params.id}`,
  };

  const client = new S3Client({
    region: "us-east-005",
    credentials,
    endpoint: "https://s3.us-east-005.backblazeb2.com",
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

//upload image to s3
router.post("/upload/:id", auth, async (req, res) => {
  const blob = JSON.stringify(req.body.data);

  try {
    const parallelUpload = new Upload({
      client: new S3Client({
        region: "us-east-005",
        credentials: defaultProvider({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }),
        endpoint: "https://s3.us-east-005.backblazeb2.com",
      }),
      params: {
        Bucket: "treemap",
        Key: `treeimages/${req.params.id}`,
        ContentType: "image/jpeg",
        Body: Buffer.from(blob, "base64"),
      },
    });

    parallelUpload.on("httpUploadProgress", (progress) => {
      console.log(progress);
    });

    await parallelUpload.done();

    res.status(200).send("Image uploaded");
  } catch (err) {
    console.log("imageReq.js", err);
    res.status(400).send(err);
  }
});

// const credentials = defaultProvider({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

// console.log(req.body);

// const options = {
//   Bucket: "treemap",
//   Key: `treeimages/${req.params.id}`,
//   Body: req.body,
//   s3ForcePathStyle: true,
// };

// const client = new S3Client({
//   region: "us-central-1",
//   credentials,
//   endpoint: "http://162.207.79.207:9000",
// });

// const command = new PutObjectCommand(options);

// try {
//   const response = await client.send(command);
//   res.status(200).send(response);
// } catch (err) {
//   console.log("imageReq.js", err);
// }

module.exports = router;
