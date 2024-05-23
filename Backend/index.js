require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.set("strictQuery", false);

// Importing Routes
const authRoutes = require("./routes/authRoutes");

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

// Testing Endpoint
app.get('/', (req, res) => {
    res.send('hi')
});

// Server Listening
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});