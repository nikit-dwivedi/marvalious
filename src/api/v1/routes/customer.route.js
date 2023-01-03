const express = require('express');
const router = express.Router();


const { onboard, getCustomerById, addKycDetails, getKycDetails, addBankDetails, editBankDetails, getBankDetails, addNomineeDetails, getNomineeDetails, changeNomineeDetails, getRifInfo, purchaseRig, getAllRigOfUser, allRigSetting, addKycAndNominee, getKycAndNominee, editBankDetail, getBalanceUser, createSettlement } = require('../controllers/customer.controller');
const { authenticateUser } = require('../middlewares/authToken');



router.post('/onboard', authenticateUser, onboard);
router.get('/', authenticateUser, getCustomerById);
router.post('/kyc', authenticateUser, addKycDetails);
router.get('/kyc', authenticateUser, getKycDetails);
router.post('/bank', authenticateUser, addBankDetails);
router.get('/bank', authenticateUser, getBankDetails);
router.post('/editBank/:bankId', authenticateUser, editBankDetails)
router.post('/nominee', authenticateUser, addNomineeDetails);
router.get('/nominee', authenticateUser, getNomineeDetails);
router.post('/nominee/edit', authenticateUser, changeNomineeDetails);
router.get('/rig/info/:rigSettingId', authenticateUser, getRifInfo);
router.get('/rig/config', authenticateUser, allRigSetting);
router.post('/rig/purchase/:rigSettingId', authenticateUser, purchaseRig);
router.get('/rig/all', authenticateUser, getAllRigOfUser)
router.post('/kyc/nominee', authenticateUser, addKycAndNominee)
router.get('/kycinfo/nomineeinfo', authenticateUser, getKycAndNominee)
router.get('/getBalanceUser', getBalanceUser)




module.exports = router;