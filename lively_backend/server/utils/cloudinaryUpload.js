const cloudinary = require("../../config/cloudinary");
const { LIVELY_PRESET } = require("../../config");

const cloudinaryUpload = async (image) => {
  let cloudUploadRes;
  try {
    cloudUploadRes = await cloudinary.uploader.upload(image, {
      upload_preset: LIVELY_PRESET,
      transformation: [
        { width: 1240, height: 1080 },
        { quality: "60" },
        { fetch_format: "webp" },
      ],
    });

    console.log("Cloudinary util: ", cloudUploadRes);

    return cloudUploadRes;
  } catch (err) {
    console.log("Cloudinary Error: ", err.message);
  }
};

module.exports = cloudinaryUpload;
