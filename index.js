const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 80;
const addSiteRoute = require("./routes/addSiteRoute");
const addTreeRoute = require("./routes/addTreeRoute");
const uri =
  "mongodb+srv://treeleaves229:dMOKFrGVhROw0J15@treemap.rly2lvi.mongodb.net/?retryWrites=true&w=majority&appName=TreeMap";
mongoose
  .connect(uri)
  .then(() => {
    app.use(express.json());
    app.use(
      cors({
        origin: "*",
      })
    );
    app.use("/tree", addTreeRoute);
    app.use("/site", addSiteRoute);

    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`App listening on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
