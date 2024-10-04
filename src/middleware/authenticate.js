const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist')

const authenticate = async (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1] 
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

        if(err.name === 'TokenExpiredError'){
            return res.status(403).json({ message: 'Access denied: Token expired' });
        }
        return res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = authenticate;

