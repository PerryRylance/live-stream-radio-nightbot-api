// Import express
const express = require('express');

// Import Body parser
const bodyParser = require('body-parser');

require('dotenv').config();
require("./src/db");

// Initialise the app
const app = express();

// Import routes
const routes = require("./src/routes");

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

// Setup server port
var port = process.env.PORT || 8080;

// Use Api routes in the App
app.use('/api', routes);

// Launch app to listen to specified port
app.listen(port, function () {
	console.log("Running service on port " + port);
});