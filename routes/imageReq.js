const router = require("express").Router();
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { defaultProvider } from "@aws-sdk/credential-provider-node";

router.get("/:id", async (req, res) => {
  const credentials = defaultProvider({
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  });

  const options = {
    Bucket: "easytree",
    Key: `treeimages/${req.params.id}`,
  };

  const client = new S3Client({ region: "us-central-1", credentials });

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
