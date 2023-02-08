require("dotenv").config();
const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// ******************** MiddleWare ****************************
server.use(express.static(process.env.STATIC_FOLDER));
server.use((req, res, next) => {
  console.log(req.method, req.ip, req.path);
  next();
});
server.use(logger());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded());
server.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60000 }
}));

// =============================================================
// GET - localhost:8080/homepage
server.get("/homepage", (request, response) => {
  // response.send("<h1>Hello</h1>");
  response.json({"name": "Ali"});
});

// Testing session
server.get("/test", (req, res) => {
  req.session.test ? req.session.test++ : req.session.test = 1;
  res.send(req.session.test.toString());
});


// Method 01 - Sending Data in request object to server using query
// GET - localhost:8080/person?name=Ali&age=27
server.get("/person", (req, res) => {
  let personName = req.query.name;
  res.json({name: personName, age: req.query.age});
});

// Method 02 - Sending Data in request object to server using params
// GET - localhost:8080/school/:name/:city
server.get("/school/:name/:city", (req, res) => {
  let schoolName = req.params.name;
  let city = req.params.city;
  res.json({name: schoolName, city});
});

// Method 03 - Sending Data in request object to server using body
// POST - localhost:8080/person (Data hidden in body usuall submit via form)
server.post("/person", (req, res) => {
  let name = req.body.name;
  let age = req.body.age;
  res.json({name, age});
});


server.post("/login",
  passport.authenticate('local'),
  function(req, res)  {
    res.redirect('/');
  }
);


server.listen(process.env.PORT, () => {
  console.log("Server Started at: http://localhost:"+process.env.PORT);
});
