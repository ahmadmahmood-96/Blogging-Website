const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/user");

const generateAndSendToken = (res, user) => {
    const token = jwt.sign({
        user: user
    }, process.env.SECRET_KEY);

    return res.status(200).json({
        message: `Login Successful`,
        token: token,
    });
};

exports.loginUser = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    const user = await User.findOne({
        email,
    });

    if (!user) {
        return res.status(400).json({
            message: 'User does not exist'
        });
    }

    // Compare passwords securely using crypto
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    if (user.password !== hashedPassword) {
        return res.status(400).json({
            message: 'Wrong Password'
        });
    }
    return generateAndSendToken(res, user);
};

exports.signupUser = async (req, res) => {
    const {
        name,
        email,
        password,
        phoneNumber
    } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({
        email,
    });

    if (existingUser) {
        return res.status(400).json({
            message: 'User already exists'
        });
    }

    // Hash the password securely using crypto
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Create a new user
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phoneNumber
    });

    try {
        // Save the new user to the database
        await newUser.save();
        // Generate and send JWT token
        return res.status(200).json({
            message: `Signup Successful`,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to create user'
        });
    }
};