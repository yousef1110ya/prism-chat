// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Mongoose User model
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1];
  const JWT_SECRET = process.env.JWT_SECRET;

  let decoded; 
  let user;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded payload:', decoded);
  } catch (err) {
    console.error('Invalid token:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
  try {
    // Look up user by ID (sub) from token
    console.log('finding the user');
    if(!decoded) console.log(decoded);
    user = await User.findOne({ mainId: parseInt(decoded.sub, 10) }).select('-password');

    if (!user) {
        try {
          console.log('creating the user');
            user = await User.create({
              username: decoded.name,      // or any appropriate field from the JWT
              mainId: parseInt(decoded.sub, 10), // Laravel user ID from the JWT `sub` claim
              // profileImage not included
            });
        
            console.log('User created:', user);
          } catch (err) {
            console.error('Error creating user:', err.message);
            throw err;
          }
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: err.message });
  }
};

module.exports = authMiddleware;
