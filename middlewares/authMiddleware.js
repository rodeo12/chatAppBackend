const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    // console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const actualToken = token.split(' ')[1];
        const decoded = jwt.verify(actualToken, process.env.Secret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
