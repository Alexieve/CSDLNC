const {Router} = require('express')
const HSBN_Controllers = require('../controllers/HSBN_Controllers')
const { preventLoginAgain, requireAuth } = require('../middleware/authMiddleware')



const router = Router()

router.get('/hsbn', requireAuth, HSBN_Controllers.HoSoBenhNhan_get)
router.get('/hsbn/init', requireAuth, HSBN_Controllers.HoSoBenhNhan_get_data)
router.post('/hsbn', requireAuth, HSBN_Controllers.HoSoBenhNhan_post)
router.get('/createHSBN', requireAuth, HSBN_Controllers.createHSBN_get)
router.post('/createHSBN', requireAuth, HSBN_Controllers.createHSBN_post)



module.exports = router;