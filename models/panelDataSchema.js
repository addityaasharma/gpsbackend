import mongoose, { mongo } from 'mongoose';

const panelDataSchema = new mongoose.Schema({
    userAuth : [{type  : mongoose.Schema.Types.ObjectId, ref : 'user'},],
    userData : [{type  : mongoose.Schema.Types.ObjectId, ref : 'punchin'},],
})

export const PanelData = mongoose.model('PanelData',panelDataSchema)