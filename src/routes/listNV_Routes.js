const {Router} = require('express')
const listNV_Controllers = require('../controllers/listNV_Controllers')
const { preventLoginAgain, requireAuth } = require('../middleware/authMiddleware')

const router = Router()

router.get('/listNV', requireAuth, listNV_Controllers.Nhansu_Nhanvien_get)
router.get('/listNV/init', requireAuth,listNV_Controllers.listNV_get_data);
router.post('/listNV', requireAuth, listNV_Controllers.Nhansu_Nhanvien_post)
router.get('/createNV', requireAuth, listNV_Controllers.createNV_get)
router.post('/createNV', requireAuth, listNV_Controllers.createNV_post)

module.exports = router;