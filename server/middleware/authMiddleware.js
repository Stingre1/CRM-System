import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // Import your User model

const authenticateJWT = async (req, res, next) => { // Make middleware function async
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Missing token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userIdFromToken = decoded.id; // Get user ID from token payload (using 'id' as per your token signing in authController.js)

        // **CRUCIAL STEP: Fetch full user from database using userIdFromToken, EXCLUDING password**
        const user = await User.findById(userIdFromToken).select('-password'); // <--- Add .select('-password')

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        req.user = user; // **Attach the FULL USER OBJECT (without password) to req.user**
        next();

    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token. Cannot authenticate user.' });
    }
};

export default authenticateJWT;