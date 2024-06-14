require("dotenv").config()

module.exports = {
    jwtSecret: process.env.Secret , // Replace with a secure secret key
    jwtExpiration: '1h'
};