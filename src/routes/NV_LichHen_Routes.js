const {Router} = require('express')
const NV_LichHen_Controllers = require('../controllers/NV_LichHen_Controllers')
const { preventLoginAgain, requireAuth } = require('../middleware/authMiddleware')



const router = Router()

router.get('/Appointmentmanage', requireAuth, NV_LichHen_Controllers.LichHen_get)
router.get('/Appointmentmanage/init', requireAuth, NV_LichHen_Controllers.LichHen_get_data)
router.post('/accept-lichhen', requireAuth, NV_LichHen_Controllers.LichHen_post)
router.post('/deny-lichhen', requireAuth, NV_LichHen_Controllers.LichHen_post2)
// router.get('/createHSBN', requireAuth, KH_HSBN_Controllers.createHSBN_get)
// router.post('/createHSBN', requireAuth, KH_HSBN_Controllers.createHSBN_post)
// router.get('/createLH', requireAuth, KH_HSBN_Controllers.createLH_get)
// router.post('/createLH', requireAuth, KH_HSBN_Controllers.createLH_post)

module.exports = router;