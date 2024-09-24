const multer = require('multer'); 
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/products/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fillerFilter = (req, file, cb) => {
    const allowedMimeTypes = /jpeg|jpg|png/;
    const extname = allowedMimeTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Only JPEG, JPG, and PNG files are allowed!"), false);
    }
};


const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit 
    fileFilter: fillerFilter 
});


module.exports = upload.array('productimages', 5);
