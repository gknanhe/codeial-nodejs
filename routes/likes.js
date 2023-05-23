const expess = require('express');
const router = expess.Router();
const likesController = require('../controllers/likes_controller');

router.post('/toggle', likesController.toggleLike);


module.exports = router;