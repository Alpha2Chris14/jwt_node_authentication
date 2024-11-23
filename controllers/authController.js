const User = require("../models/User");
const jwt = require("jsonwebtoken");
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let error = { email: "", password: "" };

  //incorrect email
  if (err.message === "incorrect email") {
    error.email = "That email is not registered";
  }

  //incorrect email
  if (err.message === "incorrect password") {
    error.password = "That password incorrect";
  }

  //duplicate error code
  if (err.code === 11000) {
    error.email = "Email already exists";
    return error;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach((properties) => {
      console.log(properties);
      error[properties.path] = properties.message;
    });
  }

  return error;
};
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "net ninja secret", { expiresIn: maxAge });
};
const signup_get = (req, res) => {
  res.render("signup");
};
const login_get = (req, res) => {
  res.render("login");
};
const signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (error) {
    let errorObj = handleErrors(error);
    res.status(400).json({ errorObj });
  }
};
const login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    let errorObj = handleErrors(err);
    res.status(400).json({ errorObj });
  }
};

const logout_get = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = { signup_get, signup_post, login_get, login_post, logout_get };
