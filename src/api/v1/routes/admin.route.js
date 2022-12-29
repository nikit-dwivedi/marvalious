const express = require('express');
const { addRigsAmount, getRigs, addRigSetting, getAllRigSetting, editRigSetting, getAllCustomer, addPartnershipByAdmin, getBalanceUser, allBalance, editBalance, editKycVerified, getAllKyc, getKycById, getBankById, getCustomerById, getCustomerPurchaseRigs, getCustomerBookedRigs } = require('../controllers/admin.controller');
const router = express.Router();


router.post('/rig', addRigsAmount);
router.get('/rig', getRigs);
router.post('/rig/config', addRigSetting)
router.post('/edit/setting/:slabSettingId', editRigSetting)
router.get('/allRigSetting', getAllRigSetting)
router.get('/allCustomers', getAllCustomer)
router.post('/addPartner', addPartnershipByAdmin)
router.get('/getBalanceUser/:customId', getBalanceUser)
router.get('/getAllBalance', allBalance)
router.post('/editBalance/:customId', editBalance)
router.post('/editKycVerified/:customId', editKycVerified)
router.post('/getAllKyc', getAllKyc)
router.get('/getKyc/:customId', getKycById)
router.get('/bank/details/:customId', getBankById)
router.get('/customer/:customerId', getCustomerById)
router.get('/purchased/rigs/:customId', getCustomerPurchaseRigs)
router.get('/booked/rigs/:customId', getCustomerBookedRigs)
module.exports = router 