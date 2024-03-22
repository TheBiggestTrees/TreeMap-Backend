const mongoose = require("mongoose");
const uri =
  "mongodb+srv://treeleaves229:dMOKFrGVhROw0J15@treemap.rly2lvi.mongodb.net/treemap/?retryWrites=true&w=majority&appName=TreeMap";

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
