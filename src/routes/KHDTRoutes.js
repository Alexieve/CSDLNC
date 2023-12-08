const {Router} = require('express')
const KHDTControllers = require('../controllers/KHDTControllers')
const { preventLoginAgain, requireAuth } = require('../middleware/authMiddleware')

const router = Router()
router.get('/khdt', requireAuth, KHDTControllers.getKHDT)
router.get('/createKHDT',  requireAuth, KHDTControllers.createKHDT1_get)
router.get('/createKHDT/:MAHSBN',  requireAuth, KHDTControllers.createKHDT2_get)
router.post('/createKHDT', requireAuth, KHDTControllers.createKHDT_post)
router.get('/khdt/init',requireAuth, KHDTControllers.KHDT_get_data)
module.exports = router;