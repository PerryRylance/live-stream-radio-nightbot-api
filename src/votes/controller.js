const qstr = require("querystring");
var LiveStreamRadio = require('lsr-wrapper');
const db = require("../db").default;

const controller = {
	get: async (req, res, next) => {

		// NB: Check for secret key
		if(!("key" in req.query))
			return res
				.status(400)
				.json({
					status: "error",
					message: "Key missing"
				});
		
		// NB: Check key is on env
		if(!("SECRET_KEY" in process.env))
			return res
				.status(500)
				.json({
					status: "error",
					message: "Key not correctly configured"
				});

		// NB: Verify key
		if(req.query.key != process.env.SECRET_KEY)
			return res
				.status(401)
				.json({
					status: "error",
					message: "Incorrect key"
				});

		// NB: Check for valid user
		if(!("nightbot-user" in req.headers))
			return res
				.status(400)
				.json({
					status: "error",
					message: "Required header Nightbot-User missing"
				});
		
		// NB: Validate user name, we'll need this for the DB
		const user = qstr.parse(req.headers["nightbot-user"]);

		if(!("displayName" in user))
			return res
				.status(400)
				.json({
					status: "error",
					message: "Nightbot-User is incorrectly formatted"
				});

		// NB: Validate the vote type
		if(!("type" in req.query))
			return res
				.status(400)
				.json({
					status: "error",
					message: "Required parameter type not supplied"
				});
		
		switch(req.query.type)
		{
			case "up":
			case "down":
				break;
			
			default:
				return res
					.status(400)
					.json({
						status: "error",
						message: "Type must be either 'up' or 'down'"
					});
		}

		if(!("STREAM_HOST" in process.env))
			return res
				.status(500)
				.json({
					status: "error",
					message: "Stream interface not configured correctly"
				});

		// NB: Find the song currently playing
		const radio = new LiveStreamRadio(process.env.STREAM_HOST, "8000", process.env.STREAM_API_KEY);
		
		// TODO: Need await here?
		const history = await radio.getStreamHistory();

		if(!history.length)
			return res
				.status(425)
				.json({
					status: "error",
					message: "Stream not ready"
				});

		const song = history[ history.length - 1 ];
		
		// TODO: Error handling please, currently just dumps to the console
		db.serialize(() => {

			let stmt;

			stmt = db.prepare("DELETE FROM votes WHERE file = ? AND name = ?");
			stmt.run(song.audio.path, user.displayName);

			stmt = db.prepare("INSERT INTO votes (file, name, type, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)");
			stmt.run(song.audio.path, user.displayName, req.query.type);

		});

		// NB: Success message
		return res.send("Thank you, your vote has been recorded! " + String.fromCodePoint(0x1F916));

	}
}

exports.default = controller;