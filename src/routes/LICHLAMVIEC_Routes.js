const {Router} = require('express')
const LICHLAMVIEC_Controllers = require('../controllers/LICHLAMVIEC_Controllers')
const { requirePermission, requireAuth } = require('../middleware/authMiddleware')

const router = Router()


router.get('/lichlamviec', requirePermission(2), LICHLAMVIEC_Controllers.xem_lichlamviec_get)
router.get('/lichlamviec/search/nhasi', requirePermission(2), LICHLAMVIEC_Controllers.search_nhasi_get)
router.get('/lichlamviec/change/:mans', requirePermission(2), LICHLAMVIEC_Controllers.changeMode_lichlamviec_get)
router.get('/lichlamviec/weekly/:mans', requirePermission(2), LICHLAMVIEC_Controllers.weeklyMode_lichlamviec_get)
router.get('/lichlamviec/monthly/:mans', requirePermission(2), LICHLAMVIEC_Controllers.monthlyMode_lichlamviec_get)
router.post('/lichlamviec/update/:mans', requirePermission(2), LICHLAMVIEC_Controllers.update_lichlamviec_post)
router.post('/lichlamviec/addNgayNghi/:mans', requirePermission(2), LICHLAMVIEC_Controllers.addNgayNghi_lichlamviec_post)


module.exports = router;