const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Unauthorized - No token provided'
        });
    }

    const token = authHeader.substring(7); // Extract token after "Bearer "

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Attach the decoded user information to the request object
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message: 'Unauthorized - Invalid token'
        });
    }
};