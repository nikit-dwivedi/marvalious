const { randomBytes } = require('node:crypto');
const { encryption } = require('../middlewares/authToken');
const kycModel = require('../models/kyc.model');
const { responseFormater } = require('./response.format');
const slabModel = require('../models/slab.model')

module.exports = {
    authFormatter: async (phone) => {
        const d = new Date
        const userId = randomBytes(4).toString('hex')
        const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
        const reqId = randomBytes(4).toString('hex')
        const date = d.getDate()
        return { userId, phone, date }
    },
    adminFormatter: (phone) => {
        const adminId = randomBytes(4).toString('hex')
        const d = new Date
        const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
        const reqId = randomBytes(4).toString('hex')
        const date = d.getDate()
        return { adminId, phone, otp, reqId, date }
    },
    customerFormatter: (userId, phone, data, customId) => {
        const customerId = randomBytes(4).toString('hex')
        return {
            userId: userId,
            customerId: customerId,
            name: data.name,
            phone: phone,
            email: data.email,
            city: data.city,
            occupation: data.occupation,
            // profileImage: imageUrl
        }
    },
    kycFormatter: (customId, kycData) => {
        return {
            customId: customId,
            name: kycData.name,
            occupation: kycData.occupation,
            selfie: kycData.selfie,
            aadhaarNumber: kycData.aadhaarNumber,
            aadhaarFront: kycData.aadhaarFront,
            aadhaarBack: kycData.aadhaarBack,
            panNumber: kycData.panNumber,
            panFront: kycData.panFront,
        }
    },
    bankFormatter: (customId, bankData) => {
        const bankId = randomBytes(4).toString('hex')
        return {
            customId: customId,
            bankId: bankId,
            bankName: bankData.bankName,
            accountNumber: bankData.accountNumber,
            ifsc: bankData.ifsc,
            accountHolderName: bankData.accountHolderName,
            upiId: bankData.upiId
        }
    },
    nomineeFormatter: (customerId, nomineeData) => {
        const { nomineeName, nomineeRelation, nomineeAadhaarNo } = nomineeData
        return { customerId, nomineeName, nomineeRelation, nomineeAadhaarNo }
    },
    slabFormatter: (numberOfSlab, previousSlabData) => {
        const totalSlab = previousSlabData ? previousSlabData.totalSlab + numberOfSlab : numberOfSlab
        const freeSlab = previousSlabData ? previousSlabData.freeSlab + numberOfSlab : numberOfSlab
        const bookedSlab = previousSlabData ? previousSlabData.bookedSlab : 0
        return { totalSlab, freeSlab, bookedSlab }
    },
    slabSettingFormatter: async (slabData) => {
        try {
            const { amount, percent, interest, locking, slotBookingCharge } = slabData
            const slabSettingId = randomBytes(4).toString('hex')
            const income = (interest * amount) / 100
            return responseFormater(true, "", { slabSettingId, amount, percent, interest, locking, income, slotBookingCharge })
        }
        catch (error) {
            // console.log(error.message);
            return responseFormater(false, error.message)
        }
    },
    partnerFormatter: (customId, rigData) => {
        const partnerId = randomBytes(4).toString('hex')
        return {
            partnerId: partnerId,
            customId: customId,
            slabInfo: {
                slabSettingId: rigData.slabSettingId,
                amount: rigData.amount,
                percent: rigData.percent,
                interest: rigData.interest,
                locking: rigData.locking,
            },
            date: dateFormatter(),
            expireDate: dateFormatter(rigData.locking)
        }
    }, 
    partnershipFormatter: (partner,noOfDays) => {
        // const partnerId = randomBytes(4).toString('hex')
        return {
            slabInfo: {
                slabSettingId: partner.slabInfo.slabSettingId,
                amount: partner.slabInfo.amount,
                percent: partner.slabInfo.percent,
                interest: partner.slabInfo.interest,
                locking: partner.slabInfo.locking,
            },
            partnerId: partner.partnerId,
            customId: partner.customId,
            expireDate: partner.expireDate,
            isActive: partner.isActive,
            profit: partner.profit,
            createdAt: partner.createdAt,
            updatedAt: partner.updatedAt,
            daysLeftForRoi:noOfDays
        }
    }, 
     bookingFormatter :(customerData, bookings) => {
        const name = customerData.name
        const phone = customerData.phone
        const percent = bookings.percent
        const slot = bookings.percent
        const bookingAmount = bookings.bookingAmount
         const remainingAmount = bookings.bookingAmount
         return { name, phone, percent, slot, bookingAmount, remainingAmount }
    }
}
const dateFormatter = (locking = false) => {
    const newDate = new Date
    const date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()
    if (locking) {
        if (locking + month > 12) {
            let yearTotal = Math.floor((locking + month) / 12)
            month = (locking + month) - 12
            year += yearTotal
        } else {
            month += locking
        }
    }
    return (`${date}-${month}-${year}`);
}
