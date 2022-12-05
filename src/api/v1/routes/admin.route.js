const express = require('express');
const { addRigsAmount, getRigs, addRigSetting } = require('../controllers/admin.controller');
const router = express.Router();


router.post('/rig', addRigsAmount);
router.get('/rig', getRigs);
router.post('/rig/config', addRigSetting)

module.exports = router