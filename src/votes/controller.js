const model = require("./model");
const qstr = require("querystring");
var LiveStreamRadio = require('lsr-wrapper');

// Handle index actions
exports.index = function (req, res) {

    model.get(async function (err, models) {

        if (err)
            return res
				.status(500)
				.json({
					status: "error",
					message: err,
				});

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

		const query = { file: song.audio.path, name: user.displayName };
		const update = { $set: { ...query, type: req.query.type }};
		const options = { upsert: true };

		await model.collection.updateOne(query, update, options);

		// NB: Success message
		return res.json({
			status: "success",
			message: "Vote recorded successfully"
		});      

    });
};