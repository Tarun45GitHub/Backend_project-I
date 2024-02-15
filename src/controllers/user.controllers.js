import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import  {UploadonCloudinary} from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js";


const registerUser= asyncHandler(async(req,res)=>{
    //1.take data from frontend
    const {username,email,fullname,password}=req.body;

    //2.validation 
    // if(fullname==="") throw new apiError(400,"fullname is required")
    if (
        [username,email,fullname,password].some((items)=>items?.trim()==="")
    ) {
        throw new apiError(400,"All field must be required");
    }

    //3.check user already exit
   const exitedUser=await User.findOne({
        $or:[{ username },{ email }]
    })
    if(exitedUser) throw new apiError(404,"username Or email already exit");

    //4.check image and avater Images
   const avatarLocalPath= req.files?.avatar[0]?.path;
   const coverImageLocalPath=req.files?.coverImage[0]?.path;
   if(!avatarLocalPath) throw new apiError(400,"avater file is required");
   const avatar=await UploadonCloudinary(avatarLocalPath);
   const coverImage=await UploadonCloudinary(coverImageLocalPath);
   if(!avatar) throw new apiError(400,"avater file is required");

   //5.cteare objet of user -entry in db
   const user= await User.create({
    fullname,avatar:avatar.url,coverImage:coverImage?.url||"",password,username:username
   })
   //remove password and refreash token from response
   const createduser= await User.findById(user._id).select("-password -refreshToken");
   if(!createduser) throw new apiError(404,"something went wrong ! please try again");

   //return response
   return res.status(201).jason(
    new apiResponse(200,createduser,"user registred successfully")
   )
})
export {registerUser};