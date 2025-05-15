import mongoose, { mongo } from 'mongoose';

const adminFormSchema = new mongoose.Schema({
    salary: {
        type: Number,
        required: true,
        min: [0, "Salary must be positive"]
    },
    entryTime: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
    },
    exitTime: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
    },
    graceTime: {
        type: Number,
        required: true,
        min: [0, "Grace time must be positive"]
    }
})


export const userForm = mongoose.model('UserForm',adminFormSchema);