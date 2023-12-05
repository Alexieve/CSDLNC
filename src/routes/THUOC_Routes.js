const {Router} = require('express')
const THUOC_Controllers = require('../controllers/THUOC_Controllers')
const { preventLoginAgain, requireAuth } = require('../middleware/authMiddleware')



const router = Router()

// router.get('/createHSBN', requireAuth, KH_HSBN_Controllers.createHSBN_get)
// router.post('/createHSBN', requireAuth, KH_HSBN_Controllers.createHSBN_post)
// router.get('/hsbn', requireAuth, KH_HSBN_Controllers.HoSoBenhNhan_get)
// router.post('/login', authController.login_post)

router.get('/thuoc', requireAuth, THUOC_Controllers.Thuoc_get)
router.get('/createThuoc', requireAuth, THUOC_Controllers.createThuoc_get)
router.post('/updateThuoc', requireAuth, THUOC_Controllers.updateThuoc_post)

module.exports = router;