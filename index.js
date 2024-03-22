require("./db");
const cors = require("cors");
const express = require("express");
const app = express();
const port = 3000;
const addSiteRoute = require("./routes/addSiteRoute");
const addTreeRoute = require("./routes/addTreeRoute");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/api/tree", addTreeRoute);
app.use("/api/site", addSiteRoute);

app.listen(port, () => {
  console.log(`App listening on ${port}`);
});
