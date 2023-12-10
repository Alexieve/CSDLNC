const {Router} = require('express')
const LICHLAMVIEC_Controllers = require('../controllers/LICHLAMVIEC_Controllers')
const { preventLoginAgain, requireAuth } = require('../middleware/authMiddleware')

const router = Router()


router.get('/lichlamviec', requireAuth, LICHLAMVIEC_Controllers.xem_lichlamviec_get)
router.get('/lichlamviec/search/nhasi', requireAuth, LICHLAMVIEC_Controllers.search_nhasi_get)
router.get('/lichlamviec/change/:mans', requireAuth, LICHLAMVIEC_Controllers.changeMode_lichlamviec_get)
router.get('/lichlamviec/weekly/:mans', requireAuth, LICHLAMVIEC_Controllers.weeklyMode_lichlamviec_get)
router.get('/lichlamviec/monthly/:mans', requireAuth, LICHLAMVIEC_Controllers.monthlyMode_lichlamviec_get)
router.post('/lichlamviec/update/:mans', requireAuth, LICHLAMVIEC_Controllers.update_lichlamviec_post)
router.post('/lichlamviec/addNgayNghi/:mans', requireAuth, LICHLAMVIEC_Controllers.addNgayNghi_lichlamviec_post)


module.exports = router;