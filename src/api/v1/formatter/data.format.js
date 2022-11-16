const { randomBytes } = require('node:crypto');
const { encryption } = require('../middlewares/authToken');

module.exports = {
    authFormatter: async (phone) => {
        const d = new Date
        const userId = randomBytes(4).toString('hex')
        const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
        const reqId = randomBytes(4).toString('hex')
        const date = d.getDate()
        return { userId, phone, otp, reqId, date }
    },
    adminFormatter: (phone) => {
        const adminId = randomBytes(4).toString('hex')
        const d = new Date
        const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
        const reqId = randomBytes(4).toString('hex')
        const date = d.getDate()
        return { adminId, phone, otp, reqId, date }
    },
    customerFormatter: (userId, phone, data) => {
        const customerId = randomBytes(4).toString('hex')
        const imageUrl = "image"
        return {
            userId: userId,
            customerId: customerId,
            name: data.name,
            phone: phone,
            email: data.email,
            profileImage: imageUrl
        }
    },
    kycFormatter: (customId, kycData, imageData) => {
        return {
            customId: customId,
            name: kycData.name,
            address: kycData.address,
            aadharNumber: kycData.aadharNumber,
            aadharFront: imageData.aadharFront,
            aadharback: imageData.aadharback,
            panNumber: kycData.panNumber,
            panFront: imageData.panFront
        }
    },
    bankFormatter: (customId, bankData) => {
        const bankId = randomBytes(4).toString('hex')
        return {
            customId: customId,
            bankId: bankId,
            bankName: bankData.bankName,
            accountNumbe: bankData.accountNumbe,
            ifsc: bankData.ifsc,
            accountHolderName: bankData.accountHolderName
        }
    },
    slabSettingFormatter :(slabData) => {
        const slabSettingId = randomBytes(4).toString('hex')
        let slot = 1/((slabData.persent * 1) / 100)
        return {
            slabSettingId: slabSettingId,
            amount: slabData.amount,
            persent: slabData.persent,
            intrest: slabData.intrest,
            locking: slabData.locking,
            slot: slot
        }
    }
}
