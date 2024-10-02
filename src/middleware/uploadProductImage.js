const multer = require('multer'); 
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(file.fieldname === 'productimages') {
            cb(null, 'public/products/');
        } else if(file.fieldname === 'variationimages') {
            cb(null, 'public/uploads/variationImages/');
        } else {
            cb(new Error('Invalid file field name'), false);
        }
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


module.exports = upload.fields([
    {name: 'productimages', maxCount: 5},
    {name: 'variationimages', maxCount: 5}
])
