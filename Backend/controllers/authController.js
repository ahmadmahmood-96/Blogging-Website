const jwt = require("jsonwebtoken");

const User = require("../models/user");

const generateAndSendToken = (res, user) => {
    const token = jwt.sign({
        user: user
    }, process.env.SECRET_KEY);

    // Successful login
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

    if (user.password !== password) {
        return res.status(400).json({
            message: 'Wrong Password'
        });
    }

    // Common logic for both cases
    return generateAndSendToken(res, user);
};