const {Router} = require('express')
const THUOC_Controllers = require('../controllers/THUOC_Controllers')
const { preventLoginAgain, requireAuth } = require('../middleware/authMiddleware')



const router = Router()

router.get('/thuoc', requireAuth, THUOC_Controllers.Thuoc_get)
router.get('/createThuoc', requireAuth, THUOC_Controllers.createThuoc_get)
router.post('/createThuoc', requireAuth, THUOC_Controllers.createThuoc_post)
router.post('/updateThuoc', requireAuth, THUOC_Controllers.updateThuoc_post)

module.exports = router;