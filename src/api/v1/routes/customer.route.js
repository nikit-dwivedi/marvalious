const express = require('express');
const { onboard, getCustomerById, addKycDetails, getKycDetails, addBankDetails, getBankDetails } = require('../controllers/customer.controller');
const { authenticateUser } = require('../middlewares/authToken');
const router = express.Router();


router.post('/onboard', authenticateUser, onboard);
router.get('/', authenticateUser, getCustomerById);
router.post('/kyc', authenticateUser, addKycDetails)
router.get('/kyc', authenticateUser, getKycDetails)
router.post('/bank', authenticateUser, addBankDetails)
router.get('/bank', authenticateUser, getBankDetails)

module.exports = router;