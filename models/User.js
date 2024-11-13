const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bycrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter an password"],
    minlength: [6, "Mininum password length is 6 characters"],
  },
});

//fires function after document has been saved
userSchema.post("save", (doc, next) => {
  console.log("New user was saved", doc);
  next();
});

//funtion run before saving data to db
userSchema.pre("save", async function (next) {
  const salt = await bycrypt.genSalt();
  this.password = await bycrypt.hash(this.password, salt);
  console.log("user about to be saved", this);
  next();
});

const User = mongoose.model("user", userSchema);
module.exports = User;
