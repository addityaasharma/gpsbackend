import express from "express";
import { PanelData } from "../../models/panelDataSchema.js";
import { User } from "../../models/userAuthSchema.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const jwt_secret = process.env.JWT_SECRET;
const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
    const { userName, email, password } = req.body;

    if (!email || !userName || !password) {
        return res.status(400).json({ message: "Please fill all required fields" });
    }

    try {
        const existUser = await User.findOne({ email, userName }).populate('PanelData');
        if (!existUser) {
            return res.status(404).json({ message: "No user found" });
        }

        const isMatch = await bcrypt.compare(password, existUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        const token = jwt.sign(
            { userID: existUser._id, email: existUser.email, userName: existUser.userName },
            jwt_secret,
            { expiresIn: "24h" }
        );

        return res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                email: existUser.email,
                userName: existUser.userName,
                id: existUser._id,
                panelData: existUser.PanelData
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
});

// Signup Route 
router.post('/signup', async (req, res) => {
    const { userName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    try {
        const hashPass = await bcrypt.hash(password, 10);

        const panelData = await PanelData.create({});

        const newUser = await User.create({
            userName,
            email,
            password: hashPass,
            PanelData: panelData._id,
        });

        return res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});

export default router;