const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 80;
const addSiteRoute = require("./routes/addSiteRoute");
const addTreeRoute = require("./routes/addTreeRoute");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const uri = process.env.MONGODB_URI;

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
    app.use("/users", userRoutes);
    app.use("/login", authRoutes);

    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`App listening on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
