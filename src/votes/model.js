const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: String,
    phone: String,
    create_date: {
        type: Date,
        default: Date.now
    }
});

// Export Contact model
const model = module.exports = mongoose.model('model', schema);
module.exports.get = function (callback, limit) {
    model.find(callback).limit(limit);
}