require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.set("strictQuery", false);

// Importing Verifying Token Middleware
const verifyToken = require("./middleware/verify");

// Importing Routes
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// Database Setup
const URI = process.env.MONGODB_URL;

mongoose
    .connect(URI)
    .then((res) => {
        console.log('MongoDB Connected');
    })
    .catch((error) => {
        console.log(error.message);
    });

// Routes
app.use('/auth', authRoutes);
app.use('/blog', verifyToken, blogRoutes);

// Testing Endpoint
app.get('/', (req, res) => {
    res.send('hi')
});

// Server Listening
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});