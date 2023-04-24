const expess = require('express');
const router = expess.Router();


const postController = require('../controllers/posts_controller');

router.post('/create', postController.create);

module.exports = router;