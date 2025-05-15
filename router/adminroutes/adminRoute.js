import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Admin } from "../../models/adminSchema.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';

// Admin Signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    try {
        const existUser = await Admin.findOne({ email });
        if (existUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await Admin.create({
            name,
            email,
            password: hashPassword
        });

        const token = jwt.sign({ userID: newUser._id, email: newUser.email, role: 'admin' }, JWT_SECRET, {
            expiresIn: '2h'
        });

        return res.status(201).json({ message: "Admin created successfully", token });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Admin Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    try {
        const existUser = await Admin.findOne({ email });
        if (!existUser) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, existUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ userID: existUser._id, email: existUser.email, role: 'admin' }, JWT_SECRET, {
            expiresIn: '2h'
        });

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

export default router;
