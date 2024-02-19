import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


export const verifyJWT=asyncHandler(async(req,_,next)=>{
   try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    console.log();
    if(!token) throw new apiError(401,"Unauthorize request")
     
    const decodeToken= jwt.verify(token.toString(),process.env.ACCESS_TOKEN_SECRET)
 
    const user=User.findById(decodeToken?._id).select("-password -refreshToken")
    if(!user) throw new apiError(401,"Invalid access Token")
 
    req.user=user //add new object name "user" or any other something
    next()
 
   } catch (error) {
    throw new apiError(401,error?.message||"Invalid Access Token")
   }
})


