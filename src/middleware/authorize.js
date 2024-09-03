const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        
        if (!req.user.role) {
            return res.status(403).json({ message: 'User role not defined' });
        }

        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'Access denied: insufficient permissions',
                userRole: req.user.role,
                requiredRoles: roles
            });
        }
        next();
    };
};

module.exports = authorize;
