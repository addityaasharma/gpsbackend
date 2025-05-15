import express from 'express';
import { User } from '../../models/userAuthSchema.js';
import { PunchInData } from '../../models/punchDataSchema.js';
import { PanelData } from '../../models/panelDataSchema.js';

const router = express.Router();

// Punch In Route
router.post('/', async (req, res) => {
    try {
        const user = await User.findById(req.user.userID); // assuming JWT middleware
        const panelDataID = user.PanelData;

        if (!panelDataID) {
            return res.status(404).json({ message: "Panel Data not found" });
        }

        const { userID, userName, email, timeStamp, location, qrLocation, locationName } = req.body;

        if(!userName){
            return res.json({message : 'No username found'})
        }

        const punchedInData = await PunchInData.create({
            userID,
            userName,
            email,
            timeStamp,
            location,
            qrLocation,
            locationName,
        });

        await PanelData.findByIdAndUpdate(panelDataID, {
            $push: { userData: punchedInData._id } // 🛠 match your PanelData schema field
        });
        console.log(punchedInData)
        return res.status(200).json({ message: "Punched in successfully",punchedInData });
    } catch (error) {
        return res.status(500).json({ message: "Internal wrong", error });
    }
});

// Get punch-in history for logged-in user
router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.user.userID);
        const panelData = await PanelData.findById(user.PanelData).populate("userData"); // 🛠 match schema field

        return res.status(200).json({ message: "Fetched successfully", punchData: panelData.userData });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error fetching data", error });
    }
});

export default router;
