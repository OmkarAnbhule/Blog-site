const router = require('express').Router()
const { createUser, verfiyUser, sendOtp, loginUser, getUser, logout } = require('../controllers/user.controller.cjs')
const { verifyOtp, isLogin, auth } = require('../middlewares/auth.cjs')

router.post('/sendOTP', isLogin, sendOtp)
router.post('/create', verifyOtp, createUser)
router.post('/login', verifyOtp, loginUser)
router.get('/verify/:email', verfiyUser)
router.get('/logout', auth, logout)
router.get('/:id', auth, getUser)

module.exports = router