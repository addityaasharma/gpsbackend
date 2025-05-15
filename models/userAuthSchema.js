import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    PanelData: { type: mongoose.Schema.Types.ObjectId, ref: 'PanelData' }
});


export const User = mongoose.model('user', userSchema);