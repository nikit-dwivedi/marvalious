const { badRequest, success } = require("./response_helper")
const { responseFormater } = require("../formatter/response.format");

exports.roiPartnership = async (newdate) => {
    try {
        const partnershipList = await partnerModel.find({ createdAt: { $lte: newdate } })
        if (partnershipList) {
            for (const partnership of partnershipList) {
                partnership = partnershipList[i]
                const principleAmount = partnership.slabInfo.amount
                const rate = partnership.slabInfo.interest
                const time = 1
                const SI = ((principleAmount * rate * time / 100) / 12) / 30
                partnership.profit = partnership.profit + SI
                await partnership.save()
                const customId = partnership.customId
                this.roiBalance(customId)
                this.roiTransaction(customId)
            }
            // return success(res, "partnership profit updated")
        }
    } catch (error) {
        return responseFormater(false, error.message)
    }
}


exports.roiBalance = async (customId) => {
    try {
        const balanceData = await balanceModel.findOne({ customId })
        balanceData.profit = balanceData.profit + SI
        await balanceData.save()
        // return success(res, "balance profit updated")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}

exports.roiTransaction = async (customId) => {
    try {
        const data = {
            customId: customId,
            type: 'Credited',
            amount: SI,
        }
        const updateTransaction = new transactionModel(data)
        await updateTransaction.save()
        // return success(res, "transaction created")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}