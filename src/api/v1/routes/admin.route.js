const express = require('express');
const { addRigsAmount, getRigs, editRigs, addRigSetting, getAllRigSetting, editRigSetting, getAllCustomer, addPartnershipByAdmin, getBalanceUser, allBalance, editBalance, editKycVerified, getAllKyc, getKycById, getBankById, getCustomerById, getCustomerPurchaseRigs, getCustomerBookedRigs, createSettlement, getAllSettlement, editSettlement, kycDelete, DailyRoi, addConfig, getConfig, createBookingByAdmin, getAllBooking, purchaseBooking, totalInvestedAmount, totalBookingAmount, bookingRejectedByAdmin } = require('../controllers/admin.controller');
const router = express.Router();


router.post('/rig', addRigsAmount);
router.get('/rig', getRigs);
router.post('/rig/edit', editRigs)
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
router.get('/settlement', createSettlement)
router.get('/allSettlements', getAllSettlement)
router.patch('/settled', editSettlement)
router.get('/kyc/fake/:customId', kycDelete)
router.post('/dailyRoi', DailyRoi)
router.post('/config', addConfig)
router.get('/allconfig', getConfig)
router.post('/booking/:customId', createBookingByAdmin)
router.get('/allBookings/:customId', getAllBooking)
router.post('/purchaseBooking/:customId', purchaseBooking)
router.post('/rejected/:bookingId', bookingRejectedByAdmin )
router.get('/partnershipAmount', totalInvestedAmount)
router.get('/bookingAmount', totalBookingAmount)



module.exports = router 