const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  let user;
  if (req.body.email) {
    user = await User.findOne({ email: req.body.email });
  } else if (req.body.username) {
    user = await User.findOne({ username: req.body.username });
  }

  if (!user || user === null || user === undefined)
    return res.status(400).send({ message: "Invalid email or password" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({ message: "Invalid email or password" });

  const token = user.generateAuthToken();
  res.status(200).send({
    data: token,
    userID: user._id,
    userData: {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      month: user.month,
      day: user.day,
      year: user.year,
    },
    message: "Signing in please wait...",
  });
});

module.exports = router;
