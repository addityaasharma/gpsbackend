import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const jwt_secret = process.env.JWT_SECRET;

export const adminMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, jwt_secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token", error: err.message });
    }
};
