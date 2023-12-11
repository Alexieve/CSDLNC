const {Router} = require('express')
const THUOC_Controllers = require('../controllers/THUOC_Controllers')
const { requirePermission, requireAuth } = require('../middleware/authMiddleware')



const router = Router()

router.get('/thuoc', requirePermission(2), THUOC_Controllers.Thuoc_get)
router.get('/list_Thuoc_dataTable', requirePermission(2), THUOC_Controllers.list_Thuoc_dataTable)
router.get('/createThuoc', requirePermission(3), THUOC_Controllers.createThuoc_get)
router.post('/createThuoc', requirePermission(3), THUOC_Controllers.createThuoc_post)
router.post('/updateThuoc', requirePermission(3), THUOC_Controllers.updateThuoc_post)

module.exports = router;