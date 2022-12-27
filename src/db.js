// Import Mongoose
const mongoose = require('mongoose');

// Connect to Mongoose and set connection variable
mongoose.connect('mongodb://localhost/live-stream-radio', { useNewUrlParser: true });
var db = mongoose.connection;

// Added check for DB connection
if (!db)
	console.log("Error connecting db")
else
	console.log("Db connected successfully");

exports.default = db;