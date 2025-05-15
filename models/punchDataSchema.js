import mongoose from 'mongoose';

const punchInSchema = new mongoose.Schema({
    userID: { type: String, require: true },
    userName: { type: String, require: true },
    email: { type: String, require: true },
    timeStamp: { type: String, require: true },
    location: {
        latitude: { type: String, require: true },
        longitude: { type: String, require: true },
    },
    qrLocation: {
        latitude: { type: String, require: true },
        longitude: { type: String, require: true },
    },
    locationName: { type: String, require: true },
});

export const PunchInData = mongoose.model('punchin', punchInSchema)