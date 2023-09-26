const express = require("express"); // loads the express package
const { engine } = require("express-handlebars"); // loads handlebars for Express
const port = 8080; // defines the port
const app = express(); // creates the Express application

// defines handlebars engine
app.engine("handlebars", engine());
// defines the view engine to be handlebars
app.set("view engine", "handlebars");
// defines the views directory
app.set("views", "./views");

// define static directory "public" to access css/ and img/
app.use(express.static("public"));

// MODEL (DATA)
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("projects-gh.db");

// CONTROLLER (THE BOSS)
app.get("/", (request, response) => {
  response.render("home.handlebars", {
    title: "Home",
    style: "home.css",
  });
});
app.get("/videos", (request, response) => {
  response.render("videos.handlebars", {
    title: "Videos",
    style: "videos.css",
  });
});
app.get("/video", (request, response) => {
  response.render("video.handlebars", {
    title: "Video",
    style: "video.css",
  });
});
app.get("/about", (request, response) => {
  response.render("about.handlebars", {
    title: "About",
    style: "about.css",
  });
});
app.get("/contact", (request, response) => {
  response.render("contact.handlebars", {
    title: "Contact",
    style: "contact.css",
  });
});
app.get("/login", (request, response) => {
  response.render("login.handlebars", {
    title: "Login",
    style: "login.css",
  });
});

// defines the final default route 404 NOT FOUND
app.use(function (req, res) {
  res.status(404).render("404.handlebars", {
    title: "Error 404",
    style: "error.css",
  });
});

// runs the app and listens to the port
app.listen(port, () => {
  console.log(`Server running and listening on port ${port}...`);
});
