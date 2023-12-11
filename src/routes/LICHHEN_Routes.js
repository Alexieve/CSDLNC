const {Router} = require('express')
const LICHHEN_Controllers = require('../controllers/LICHHEN_Controllers')
const { requirePermission, requireAuth } = require('../middleware/authMiddleware')

const router = Router()


router.get('/createLH', requireAuth, LICHHEN_Controllers.createLH_get)
router.post('/createLH', requireAuth, LICHHEN_Controllers.createLH_post)
router.get('/createLH/search/patients', requireAuth, LICHHEN_Controllers.search_hsbn_get)
router.get('/createLH/search/chinhanh', requireAuth, LICHHEN_Controllers.search_chinhanh_get)
router.get('/createLH/search/nhasi/:MACN', requireAuth, LICHHEN_Controllers.search_nhasi_get)
router.get('/addTaiKham', requirePermission(2), LICHHEN_Controllers.createTaiKham_get)
router.post('/addTaiKham', requirePermission(2), LICHHEN_Controllers.createTaiKham_post)

module.exports = router;
