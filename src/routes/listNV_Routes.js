const {Router} = require('express')
const listNV_Controllers = require('../controllers/listNV_Controllers')
const { requirePermission, requireAuth } = require('../middleware/authMiddleware')

const router = Router()

router.get('/listNV', requirePermission(3), listNV_Controllers.Nhansu_Nhanvien_get)
router.get('/listNV/init', requirePermission(3),listNV_Controllers.listNV_get_data);
router.post('/listNV', requirePermission(3), listNV_Controllers.Nhansu_Nhanvien_post)
router.get('/createNV', requirePermission(3), listNV_Controllers.createNV_get)
router.post('/createNV', requirePermission(3), listNV_Controllers.createNV_post)

module.exports = router;