const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
  min: 8,
  max: 32,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  requirementCount: 3,
};

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  month: { type: String, required: true },
  day: { type: String, required: true },
  year: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, isAdmin: this.isAdmin },
    process.env.JWTPRIVATEKEY,
    { expiresIn: "7d" }
  );
  return token;
};

const validate = (user) => {
  const schema = joi.object({
    username: joi.string().min(5).max(16).required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    password: passwordComplexity(complexityOptions, "password").required(),
    month: joi.string().required(),
    day: joi.string().required(),
    year: joi.string().required(),
  });
  return schema.validate(user);
};

const User = mongoose.model("user", userSchema);

module.exports = { User, validate };
