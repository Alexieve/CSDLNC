const {Router} = require('express')
const KH_HSBN_Controllers = require('../controllers/KH_HSBN_Controllers')
const { preventLoginAgain, requireAuth } = require('../middleware/authMiddleware')



const router = Router()

router.get('/createHSBN', requireAuth, KH_HSBN_Controllers.createHSBN_get)
router.post('/createHSBN', requireAuth, KH_HSBN_Controllers.createHSBN_post)
router.get('/hsbn', requireAuth, KH_HSBN_Controllers.HoSoBenhNhan_get)
// router.post('/login', authController.login_post)


module.exports = router;