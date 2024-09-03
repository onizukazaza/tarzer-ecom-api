const express = require('express')
const router = express.Router()
const usercontroller = require('../controllers/usercontroller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.post('/register', usercontroller.register)
router.post('/login', usercontroller.login)
router.patch('/:id/role', authenticate, authorize(['admin']), usercontroller.updateRole)
router.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router