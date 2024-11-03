const express = require('express')
const router = express.Router()
const authcontroller = require('../controllers/authcontroller');
const admincontroller = require('../controllers/admincontroller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
// const uploadProfileImage = require('../middleware/uploadProductImage');
const TokenBlacklist = require('../models/TokenBlacklist');

router.post('/register', authcontroller.register)
router.post('/login', authcontroller.login)
router.patch('/:id/role', authenticate, authorize(['admin']), admincontroller.updateRole)
// router.patch('/profile-image', authenticate, uploadProfileImage, usercontroller.updateProfileImage);
router.post('/refresh-token', authcontroller.refreshToken)
router.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});
router.get('/users', authcontroller.getAllUsers);
router.get('/users/:id',authcontroller.getUserById);
router.post('/logout', authenticate, async (req, res) => {
    
    const  authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid or missing token' });
    }

    const token = authHeader.split(' ')[1];

    try{
        await TokenBlacklist.create({ token })
        res.status(200).json({ message: 'Logged out successfully' });
    }catch(err){
        console.error('Error while logging out:', err);
        res.status(500).json({ message: 'Server error while logging out' });
    } 
});



module.exports = router