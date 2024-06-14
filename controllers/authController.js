const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User  = require('../models/User')
require('dotenv').config();

// User registration controller
const register = async (req, res) => {
    try {
        const { userId, deviceId, fullName, phone,availCoins,isPrimeMember, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { userId } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            userId,
            deviceId,
            fullName,
            phone,
            availCoins,
            isPrimeMember,
            password: hashedPassword
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error registering user', error });

    }
};

// User login controller
const login = async (req, res) => {
    try {
        const { userId, password } = req.body;
        
        // console.log(req.body)
        // Check if the user exists
        const user = await User.findOne({ where: { userId } });
        // console.log(user)
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.userId, id: user.id }, process.env.Secret, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error logging in', error });
    }
};

module.exports = {
    register,
    login
};
