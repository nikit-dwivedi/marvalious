const { randomBytes } = require('node:crypto');
const { encryption } = require('../middlewares/authToken');
const { responseFormater } = require('./response.format');

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
            city: data.city,
            occupation: data.occupation,
            profileImage: imageUrl
        }
    },
    kycFormatter: (customId, kycData) => {
        return {
            customId: customId,
            name: kycData.name,
            address: kycData.address,
            aadhaarNumber: kycData.aadhaarNumber,
            aadhaarFront: kycData.aadhaarFront,
            aadhaarBack: kycData.aadhaarBack,
            panNumber: kycData.panNumber,
            panFront: kycData.panFront
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
            accountHolderName: bankData.accountHolderName
        }
    },
    nomineeFormatter: (customerId, nomineeData) => {
        const { name, relation, aadhaarNo } = nomineeData
        return { customerId, name, relation, aadhaarNo }
    },
    slabFormatter: (numberOfSlab, previousSlabData) => {
        const totalSlab = previousSlabData ? previousSlabData.totalSlab + numberOfSlab : numberOfSlab
        const freeSlab = previousSlabData ? previousSlabData.freeSlab + numberOfSlab : numberOfSlab
        const bookedSlab = previousSlabData ? previousSlabData.bookedSlab : 0
        return { totalSlab, freeSlab, bookedSlab }
    },
    slabSettingFormatter: (slabData) => {
        try {
            const { amount, percent, interest, locking } = slabData
            const slabSettingId = randomBytes(4).toString('hex')
            const income = (interest * amount) / 100
            let slot = 1 / ((percent * 1) / 100)
            return responseFormater(true, "", { slabSettingId, amount, percent, interest, locking, income, slot })
        }
        catch (error) {
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
