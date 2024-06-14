const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiration } = require('../config/jwtConfig');

const generateToken = (payload) => {
    return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, jwtSecret);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

module.exports = {
    generateToken,
    verifyToken
};
