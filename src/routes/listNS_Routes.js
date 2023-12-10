const { Router } = require('express');
const listNS_Controllers = require('../controllers/listNS_Controllers');
const { preventLoginAgain, requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.get('/listNS', requireAuth, listNS_Controllers.Nhansu_Nhasi_get);
router.get('/listNS/init', requireAuth,listNS_Controllers.listNS_get_data);
router.post('/listNS', requireAuth, listNS_Controllers.Nhansu_Nhasi_post);
router.get('/createNS', requireAuth, listNS_Controllers.createNS_get)
router.post('/createNS', requireAuth, listNS_Controllers.createNS_post)

module.exports = router;
