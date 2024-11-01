const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoute");
const app = express();

// middleware
app.use(express.static("public"));

// view engine
app.set("view engine", "ejs");

// database connection
// const dbURI =
///   "mongodb+srv://shaun:test1234@cluster0.del96.mongodb.net/node-auth";
const dbURI = "mongodb+srv://root:test1234@ninja.29c4u.mongodb.net/node-auth";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", (req, res) => res.render("smoothies"));
app.use(authRoutes);
