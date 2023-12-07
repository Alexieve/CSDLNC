const {Router} = require('express')
const KH_HSBN_Controllers = require('../controllers/KH_HSBN_Controllers')
const { preventLoginAgain, requireAuth } = require('../middleware/authMiddleware')



const router = Router()

router.get('/hsbn', requireAuth, KH_HSBN_Controllers.HoSoBenhNhan_get)
router.get('/hsbn/init', requireAuth, KH_HSBN_Controllers.HoSoBenhNhan_get_data)
router.post('/hsbn', requireAuth, KH_HSBN_Controllers.HoSoBenhNhan_post)
router.get('/createHSBN', requireAuth, KH_HSBN_Controllers.createHSBN_get)
router.post('/createHSBN', requireAuth, KH_HSBN_Controllers.createHSBN_post)
router.get('/createLH', requireAuth, KH_HSBN_Controllers.createLH_get)
router.post('/createLH', requireAuth, KH_HSBN_Controllers.createLH_post)
router.get('/createLH/search/patients', requireAuth, KH_HSBN_Controllers.search_hsbn_get)
router.get('/createLH/search/chinhanh', requireAuth, KH_HSBN_Controllers.search_chinhanh_get)
router.get('/createLH/search/nhasi/:MACN', requireAuth, KH_HSBN_Controllers.search_nhasi_get)


module.exports = router;