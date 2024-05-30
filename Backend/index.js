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
const blogRoutes = require("./routes/blogRoutes");

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 50000
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
app.use('/blog', blogRoutes);

// Testing Endpoint
app.get('/', (req, res) => {
    res.send('hi')
});

// Server Listening
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});