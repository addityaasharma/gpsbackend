import express from "express";
import { PunchInData } from "../../models/punchDataSchema.js";

const router = express.Router();

router.get('/',async(req,res)=>{
    try{
        const user = await PunchInData.find();
        res.json({message : "Fetched Successfully", user})
    } catch(error){
        res.json({message : 'something error',error})
    }
})

export default router;