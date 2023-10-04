var express = require('express');
var router = express.Router();
const { auth, otoritas} = require('../middlewares/auth')
const { cached } = require('../middlewares/redis')
const { all, me, signin, index, create, update, destroy, find} = require('../controllers/UserController')

router.get('/', auth, index);
router.get('/me', auth, me);
router.get('/all', auth, cached, all);
router.get('/:id', auth, find);
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, destroy);
router.post('/signin',signin);

module.exports = router;
