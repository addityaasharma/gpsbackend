import mongoose from "mongoose";
import punchinRoute from './router/userroutes/punchinRoutes.js';
import userRoute from './router/userroutes/userRouter.js';
import userDetailRouter from './router/adminroutes/userDetailRouter.js';
import { authMiddleware } from "./middleware.js";
import dotenv from 'dotenv';
import express from "express";
import cors from 'cors';
import os from 'os';
import { adminMiddleware } from "./adminMiddleware.js";
import adminRoute from './router/adminroutes/adminRoute.js'
import userFormRoutes from './router/adminroutes/userFormRoutes.js'

dotenv.config();

const app = express();
const mongoString = process.env.MONGO_URI;
const PORT = process.env.PORT;

if (!mongoString || !PORT) {
    console.error("❌ Missing MONGO_URI or PORT in .env");
    process.exit(1);
}

app.use(express.json());
app.use(cors());

//for users
app.use('/user', userRoute);
app.use('/data', authMiddleware, punchinRoute);

// for admin works
app.use('/fetchdata',userDetailRouter);
app.use('/admin', adminRoute) //for login/logout
app.use('/form', userFormRoutes) 

app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// IP setup
const networkInterfaces = os.networkInterfaces();
let localIp = 'localhost';
for (const interfaceName of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[interfaceName]) {
        if (net.family === 'IPv4' && !net.internal) {
            localIp = net.address;
            break;
        }
    }
}

// DB + Server
mongoose.connect(mongoString)
    .then(() => {
        console.log('✅ Mongoose Connected Successfully');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running at: http://${localIp}:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Mongoose connection error:', error);
    });
