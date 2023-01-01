const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/station.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {

	if(!err)
		return; // NB: All OK
	
	throw err;

});

exports.default = db;