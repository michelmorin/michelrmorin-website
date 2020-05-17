// Required dependencies
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

//App Config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(methodOverride('_method'));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(5000, function () {
  console.log("Server Started!");
});
