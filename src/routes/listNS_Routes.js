const { Router } = require('express');
const listNS_Controllers = require('../controllers/listNS_Controllers');
const { requirePermission, requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.get('/listNS', requirePermission(3), listNS_Controllers.Nhansu_Nhasi_get);
router.get('/listNS/init', requirePermission(3),listNS_Controllers.listNS_get_data);
router.post('/listNS', requirePermission(3), listNS_Controllers.Nhansu_Nhasi_post);
router.get('/createNS', requirePermission(3), listNS_Controllers.createNS_get)
router.post('/createNS', requirePermission(3), listNS_Controllers.createNS_post)

module.exports = router;
