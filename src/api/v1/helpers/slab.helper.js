const slabModel = require('../models/slab.model');
const { slabFormatter, slabSettingFormatter } = require('../formatter/data.format');
const { responseFormater } = require('../formatter/response.format');
const slabSettingModel = require('../models/slabSetting.model');

exports.addSlab = async (numberOfRig) => {
    try {
        const currentSlabData = await slabModel.findOne({})
        const formattedData = slabFormatter(numberOfRig, currentSlabData);
        if (!currentSlabData) {
            const saveData = new slabModel(formattedData)
            await saveData.save()
        } else {
            await slabModel.findByIdAndUpdate(currentSlabData._id, formattedData)
        }
        return responseFormater(true, "slab added")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.getSlab = async () => {
    try {
        const slabData = await slabModel.findOne().select("-_id -__v")
        console.log(slabData);
        return slabData ? responseFormater(true, "slab detail", slabData) : responseFormater(false, "slab not completed")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.addSlabSetting = async (slabData) => {
    try {
        const { status, message, data } = await slabSettingFormatter(slabData)
        if (!status) {
            console.log(message);
            return responseFormater(false, message)
        }
        const settingCheck = await slabSettingModel.findOne({ amount: data.amount, percent: data.percent, interest: data.interest, locking: data.locking })
        if (settingCheck) {
            return responseFormater(false, "setting already exists")
        }
        const saveData = new slabSettingModel(data);
        await saveData.save()
        return responseFormater(true, "setting added")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.getAllSlabSetting = async () => {
    try {
        const slabSettingList = await slabSettingModel.find().select("-_id -__v")
        return slabSettingList[0] ? responseFormater(true, "Setting list", slabSettingList) : responseFormater(false, "No setting added")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.getSlabSettingById = async (slabSettingId, purchasedSlots) => {
    try {
        const settingData = await slabSettingModel.findOne({ slabSettingId }).select("-_id -__v")
        if (!settingData) {
            return responseFormater(false, "no setting found")
        }
        const slabData = await slabModel.findOne()
        const { availableSlot, slotToShow } = remainingSlotCalculator(purchasedSlots, slabData.freeSlab, settingData.slot)
        settingData._doc.availableSlot = availableSlot
        settingData._doc.slotToShow = slotToShow
        return responseFormater(true, "rig detail", settingData)
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.changeSlabToBooked = async (number = 1) => {
    try {
        const changeData = await slabModel.findOne()
        changeData.freeSlab -= number
        changeData.bookedSlab += number
        await changeData.save()
        return responseFormater(true, "updated")
    } catch (error) {
        return responseFormater(false, "not updated")
    }
}



const remainingSlotCalculator = (purchasedSlots = 0, totalSlotAvailable, settingSlotAvailable) => {
    const slotPartitions = Math.floor(purchasedSlots / settingSlotAvailable) + 1
    const extraSlotInPartition = (settingSlotAvailable * slotPartitions) - purchasedSlots
    const availableSlot = extraSlotInPartition + ((totalSlotAvailable - 1) * settingSlotAvailable)
    return { availableSlot, slotToShow: extraSlotInPartition }
}
