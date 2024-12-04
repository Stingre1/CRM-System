import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Attach user data to request
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }

};

export default authenticateToken;
