const slabModel = require('../models/slab.model');
const { slabFormatter } = require('../formatter/data.format');
const { responseFormater } = require('../formatter/response.format');

exports.addSlab = async (slabData) => {
    try {
        const formattedData = slabFormatter(slabData);
        const saveData = new slabModel(formattedData)
        await saveData.save()
        return responseFormater(true, "slab added")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.getSlab = async (slabId) => {
    try {
        const slabData = await slabModel.findOne({ slabId });
        return slabData ? responseFormater(true, "slab detail", slabData) : responseFormater(false, "slab not completed")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.getAllSlab = async () => {
    try {
        const slabList = await slabModel.find()
        return slabList[0] ? responseFormater(true, "slab list", slabList) : responseFormater(false, "no slab found")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}