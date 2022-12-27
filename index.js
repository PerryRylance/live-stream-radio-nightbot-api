// Import express
const express = require('express');

// Import Body parser
const bodyParser = require('body-parser');

// Import Mongoose
const mongoose = require('mongoose');

// Initialise the app
const app = express();

// Import routes
const routes = require("./src/routes");

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

// Connect to Mongoose and set connection variable
mongoose.connect('mongodb://localhost/live-stream-radio', { useNewUrlParser: true });
var db = mongoose.connection;

// Added check for DB connection
if (!db)
	console.log("Error connecting db")
else
	console.log("Db connected successfully")

// Setup server port
var port = process.env.PORT || 8080;

// Use Api routes in the App
app.use('/api', routes);

// Launch app to listen to specified port
app.listen(port, function () {
	console.log("Running RestHub on port " + port);
});