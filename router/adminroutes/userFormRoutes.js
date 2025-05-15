import express from 'express';
import { userForm } from '../../models/adminFormSchema.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { salary, entryTime, exitTime, graceTime } = req.body;

    if (!salary || !entryTime || !exitTime || !graceTime) {
        return res.json({ message: 'All fields are required' })
    }

    try {
        const userForm = await userForm.create({
            salary,
            entryTime,
            exitTime,
            graceTime,
        })

        return res.status(200).json({ message: "form created successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { salary, entryTime, exitTime, graceTime } = req.body;

    try {
        const checkForm = await userForm.findById(id);

        if (!checkForm) {
            return res.json({ message: "No form found with these detail :", form: null })
        }

        const updateForm = await userForm.findByIdAndUpdate(id,
            {
                salary: salary || checkForm.salary,
                entryTime: entryTime || checkForm.entryTime,
                exitTime: exitTime || checkForm.exitTime,
                graceTime: graceTime || checkForm.graceTime,
            },
            {
                new: true
            })

        return res.status(200).json({ message: "Form updated Sucessfully" })
    } catch (error) {
        console.log("Error Updating", error)
        return res.status(404).json({ message: "Internal Server Error",error })
    }
})

router.get('/', async (req, res) => {
    const formDetails = await userForm.find();

    if (!formDetails) {
        return res.status(404).json({ message: 'No form found' })
    }

    return res.status(200).json({ message: "Form fetched successfully", formDetails })
})

export default router;