const {Router} = require('express')
const KH_HSBN_Controllers = require('../controllers/KH_HSBN_Controllers')
const { preventLoginAgain, requireAuth } = require('../middleware/authMiddleware')



const router = Router()

router.get('/hsbn', requireAuth, KH_HSBN_Controllers.HoSoBenhNhan_get)
router.post('/hsbn', requireAuth, KH_HSBN_Controllers.HoSoBenhNhan_post)
router.get('/createHSBN', requireAuth, KH_HSBN_Controllers.createHSBN_get)
router.post('/createHSBN', requireAuth, KH_HSBN_Controllers.createHSBN_post)
router.get('/createLH', requireAuth, KH_HSBN_Controllers.createLH_get)
router.post('/createLH', requireAuth, KH_HSBN_Controllers.createLH_post)

module.exports = router;