const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Expected format: "Bearer <token>"
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretlaundrykey123');
        req.user = decoded; // { id, username, role }
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Requires Admin privileges' });
    }
};

module.exports = { authMiddleware, adminMiddleware };
