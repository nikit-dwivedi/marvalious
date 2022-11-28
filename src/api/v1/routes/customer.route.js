const express = require('express');
const router = express.Router();

const { onboard, getCustomerById, addKycDetails, getKycDetails, addBankDetails, getBankDetails, addNomineeDetails, getNomineeDetails, changeNomineeDetails, getRifInfo, purchaseRig, getAllRigOfUser } = require('../controllers/customer.controller');
const { authenticateUser } = require('../middlewares/authToken');


router.post('/onboard', authenticateUser, onboard);
router.get('/', authenticateUser, getCustomerById);
router.post('/kyc', authenticateUser, addKycDetails);
router.get('/kyc', authenticateUser, getKycDetails);
router.post('/bank', authenticateUser, addBankDetails);
router.get('/bank', authenticateUser, getBankDetails);
router.post('/nominee', authenticateUser, addNomineeDetails);
router.get('/nominee', authenticateUser, getNomineeDetails);
router.post('/nominee/edit', authenticateUser, changeNomineeDetails);
router.get('/rig/info/:rigSettingId', authenticateUser, getRifInfo);
router.get('/rig/purchase/:rigSettingId', authenticateUser, purchaseRig);
router.get('/rig/all', authenticateUser, getAllRigOfUser)

module.exports = router;