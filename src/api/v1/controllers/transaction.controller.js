const { unknownError, success, badRequest, created } = require("../helpers/response_helper")
const { parseJwt } = require("../middlewares/authToken");
const transactionModel = require("../models/transaction.model")



const addtransaction = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        if (!token.customId) {
            return badRequest(res, "please onboard first")
        }
        const customId = token.customId
        const transactionDate = new Date().toLocaleDateString('en-IN')
        const data = {
            customId: customId,
            type: req.body.type,
            amount: req.body.amount,
            date:transactionDate
        }
        const formattedData = new transactionModel(data)
        await formattedData.save()
        return formattedData ? success(res, "transaction created" ) : badRequest(res, "transaction failed")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}

const allTransaction = async (req, res) => {
    try {
        const data = await transactionModel.find().sort({amount:-1})
        return data ? success(res, "here all the transcations" , data) : badRequest(res, "transaction not found")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}   


const transactionById = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        if (!token.customId) {
            return badRequest(res, "please onboard first")
        }
        const customId = token.customId
        const data = await transactionModel.findOne(customId)
        return data ? success(res, "here are the transaction", data) : badRequest(res, "transaction not found")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}





module.exports = { addtransaction, allTransaction, transactionById }