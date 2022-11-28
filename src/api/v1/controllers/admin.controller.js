const { success, badRequest, unknownError } = require("../helpers/response_helper")
const { addSlab, getSlab, addSlabSetting, getAllSlabSetting } = require("../helpers/slab.helper")

exports.registerAdmin = async (req, res) => {
    try {

    } catch (error) {

    }
}

exports.addRigsAmount = async (req, res) => {
    try {
        const { numberOfRig } = req.body
        const { status, message, data } = await addSlab(numberOfRig)
        return status ? success(res, message) : badRequest(res, message)
    } catch (error) {
        return unknownError(res, error.message)
    }
}

exports.getRigs = async (req, res) => {
    try {
        const { status, message, data } = await getSlab();
        return status ? success(res, message, data) : badRequest(res, message)
    } catch (error) {
        return unknownError(res, error.message)
    }
}

exports.addRigSetting = async (req, res) => {
    try {
        const { status, message } = await addSlabSetting(req.body)
        return status ? success(res, message) : badRequest(res, message)
    } catch (error) {
        return unknownError(res, error.message)
    }
}

exports.allRigSetting = async (req, res) => {
    try {
        const { status, message ,data} = await getAllSlabSetting()
        return status ? success(res, message,data) : badRequest(res, message)
    } catch (error) {
        return unknownError(res, error.message)
    }
}