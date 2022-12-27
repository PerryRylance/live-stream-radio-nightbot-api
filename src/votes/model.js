const mongoose = require('mongoose');

const schema = mongoose.Schema({
	file: {
		type: String,
		required: true
	},
    name: {
        type: String,
        required: true
    },
    type: {
		type: String,
		enum: ["up", "down"]
	},
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Export Contact model
const model = module.exports = mongoose.model('vote', schema);
module.exports.get = function (callback, limit) {
    model.find(callback).limit(limit);
}