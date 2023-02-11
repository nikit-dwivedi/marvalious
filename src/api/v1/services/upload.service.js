require('dotenv').config()
const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


exports.uploadFile = async (pdfPath) => {
    try {
        const result = await cloudinary.uploader.upload(pdfPath, { folder: '' })
        console.log(result.secure_url);
        return result.secure_url
    } catch (error) {
        console.log(error.message)
    }
}