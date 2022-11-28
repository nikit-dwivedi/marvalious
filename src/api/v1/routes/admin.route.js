const express = require('express');
const { addRigsAmount, getRigs, addRigSetting, allRigSetting } = require('../controllers/admin.controller');
const router = express.Router();


router.post('/rig', addRigsAmount);
router.get('/rig', getRigs);
router.post('/rig/config', addRigSetting)
router.get('/rig/config', allRigSetting)

module.exports = router