const express = require('express');
const { addRigsAmount, getRigs, addRigSetting, editRigSetting } = require('../controllers/admin.controller');
const router = express.Router();


router.post('/rig', addRigsAmount);
router.get('/rig', getRigs);
router.post('/rig/config', addRigSetting)
router.post('/edit/setting/:slabSettingId', editRigSetting)
module.exports = router 