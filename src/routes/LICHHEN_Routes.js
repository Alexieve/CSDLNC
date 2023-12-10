const {Router} = require('express')
const NV_LichHen_Controllers = require('../controllers/NV_LichHen_Controllers')
const { preventLoginAgain, requireAuth } = require('../middleware/authMiddleware')



const router = Router()

router.get('/Appointmentmanage', requireAuth, NV_LichHen_Controllers.LichHen_get)
router.get('/Appointmentmanage/init', requireAuth, NV_LichHen_Controllers.LichHen_get_data)
router.post('/accept-lichhen', requireAuth, NV_LichHen_Controllers.LichHen_post)
router.post('/deny-lichhen', requireAuth, NV_LichHen_Controllers.LichHen_post2)

router.get('/updateLH', requireAuth, NV_LichHen_Controllers.updateLH_get);
router.post('/updateLH', requireAuth, NV_LichHen_Controllers.updateLH_post)
router.get('/updateLH/search/patients', requireAuth, NV_LichHen_Controllers.search_hsbn_get)
router.get('/updateLH/search/chinhanh', requireAuth, NV_LichHen_Controllers.search_chinhanh_get)
router.get('/updateLH/search/nhasi/:MACN', requireAuth, NV_LichHen_Controllers.search_nhasi_get)

module.exports = router;
