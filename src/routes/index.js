const express = require('express')
const router = express.Router()
const usercontroller = require('../controllers/usercontroller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
// const uploadProfileImage = require('../middleware/uploadProductImage');
const TokenBlacklist = require('../models/TokenBlacklist');

router.post('/register', usercontroller.register)
router.post('/login', usercontroller.login)
router.patch('/:id/role', authenticate, authorize(['admin']), usercontroller.updateRole)
// router.patch('/profile-image', authenticate, uploadProfileImage, usercontroller.updateProfileImage);

router.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

router.post('/logout', authenticate, async (req, res) => {
    const token = req.header('Authorization').split(' ')[1];
    try{
        await TokenBlacklist.create({ token })
        res.status(200).json({ message: 'Logged out successfully' });
    }catch(err){
        console.error('Error while logging out:', err);
        res.status(500).json({ message: 'Server error while logging out' });
    } 
});


module.exports = router