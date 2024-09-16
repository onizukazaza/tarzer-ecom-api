const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist')

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').startsWith('Bearer ') 
        ? req.header('Authorization').split(' ')[1] 
        : null;

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    try {
        const blacklistedToken = await TokenBlacklist.findOne({ where: { token } });
        if(blacklistedToken) { 
        return res.status(401).json({ message: 'Access denied' });
    }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; 
        console.log(req.user); 
        next(); 
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = authenticate;
