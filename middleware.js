// authMiddleware.js
require('dotenv').config();

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
console.log(secret);

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Assuming you store the token in a cookie

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.userId = decoded.userId;
    next(); // Call next middleware
  });
};

module.exports = verifyToken;
