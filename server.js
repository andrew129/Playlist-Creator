const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const passport = require("./passport/index");
const routes = require('./routes')
const mongoose = require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser')
var flash = require('connect-flash');

app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb",  extended: true, parameterLimit: 1000000 }));
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

require('dotenv').config()

mongoose.connect(
	process.env.MONGODB_URI || 'mongodb://localhost/playlistDB',
	{
	  useNewUrlParser: true,
	  useUnifiedTopology: true,
	  useCreateIndex: true,
	  useFindAndModify: false
	}
)

app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

app.use(routes)


// app.use((error, req, res, next) => {
// 	console.log('This is the rejected field ->', error.field);
// });

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, function() {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
