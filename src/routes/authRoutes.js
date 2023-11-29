const {Router} = require('express')
const authController = require('../controllers/authControllers')
const { preventLoginAgain, requireAuth } = require('../middleware/authMiddleware')



const router = Router()

router.get('/login', preventLoginAgain, authController.login_get)
router.post('/login', authController.login_post)
router.get('/register', preventLoginAgain, authController.register_get)
router.get('/logout', requireAuth, authController.logout_get)
router.get('/', requireAuth, authController.home_get)


module.exports = router;