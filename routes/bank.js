var express = require('express')
var router = express.Router()
const { auth } = require('../middlewares/auth')
const { cached } = require('../middlewares/redis')
const { all, me, find, index, create, update, destroy } = require('../controllers/BankController')

router.get('/all', auth, cached, all)
router.get('/me', auth, me)
router.get('/:id', auth, find)
router.get('/', auth, index)
router.post('/', auth, create)
router.put('/:id', auth, update)
router.delete('/:id', auth, destroy)

module.exports = router