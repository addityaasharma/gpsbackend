import { User } from "../models/loginModel";

export const postProduct = async(req,res)=>{
    const { name,status,date,uniqueID,email } = req.body;
    
    if(!status, !uniqueID){
        res.json({message : "No status or unique id Found"})
    }

    try{
        const User = await User
    }
}