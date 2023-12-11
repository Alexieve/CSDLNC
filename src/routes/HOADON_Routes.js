const {Router} = require('express')
const HOADON_Controllers = require('../controllers/HOADON_Controllers')
const { requirePermission, requireAuth } = require('../middleware/authMiddleware')



const router = Router()

router.get('/hoadon', requirePermission(3), HOADON_Controllers.Hoadon_get)
router.get('/createHoadon', requirePermission(3), HOADON_Controllers.createHoadon_get)
router.get('/list_Hoadon_dataTable', requirePermission(3), HOADON_Controllers.list_Hoadon_dataTable)
router.post('/createHoadon', requirePermission(3), HOADON_Controllers.createHoadon_post)
router.get('/khdt_get', requireAuth, HOADON_Controllers.khdt_get)
router.get('/makh_get', requireAuth, HOADON_Controllers.makh_get)
// router.post('/createHoadon', requireAuth, HOADON_Controllers.createHoadon_post)

module.exports = router;