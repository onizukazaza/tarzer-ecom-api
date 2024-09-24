const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/upload/profileImages");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
})

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = /jpeg|jpg|png/;
    const extname = allowedMimeTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb( null,true )
    }else{
        cb(new Error("Only JPEG, JPG and PNG files are allowed!"), false )
    }
}

const upload = multer({
    storage : storage,
    fileFilter : fileFilter, 
})

module.exports = upload;










exports.uploadProfileImage = upload.single("profileImage")

upload.single("profileImage"),
async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id)
        if(!user) {
            return res.status(404).json({ message: "User not found" })
        }

        user.profileImage = `/upload/profileImages/${req.file.filename}`
        await user.save()

    }catch(error) {

    }
}