const model = require("./model");

// Handle index actions
exports.index = function (req, res) {
    model.get(function (err, models) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Models retrieved successfully",
            data: models
        });
    });
};