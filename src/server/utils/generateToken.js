
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // Using a shorter expiration time for better security and faster token refresh
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '7d',  // Changed from 30d to 7d for better security
  });
};

export default generateToken;
