const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    phoneNumber: {
        type: String
    }
});

// Base User model
const User = mongoose.model('Users', userSchema);

module.exports = User;