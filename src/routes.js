const controller = require('./votes/controller').default;

// Initialize express router
const router = require('express').Router();

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'Service running',
        message: 'Live stream radio Nightbot API is running'
    });
});

// Contact routes
router
	.route('/votes')
    .get(controller.get);

// Export API routes
module.exports = router;