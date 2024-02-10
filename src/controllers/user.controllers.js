// import { asyncHandler } from "../utils/asyncHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser= asyncHandler(async(req,res)=>{
    const {fullName,email}=req.body;
    console.log(("email",email));
})
export {registerUser};