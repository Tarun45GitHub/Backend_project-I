import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import  {UploadonCloudinary} from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js";
import  jwt  from "jsonwebtoken";

const TokensGenarator=async(userId)=>{
    try {
        const user=await User.findById(userId)
        const refreshToken= await user.RefreshTokenGenarate();
        const accessToken= await user.AccessTokenGenarate();

        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false})


        return {refreshToken,accessToken}

    } catch (error) {
        throw new apiError(500,"Something went wrong while token genarating");
    }
    
}

const registerUser= asyncHandler(async(req,res)=>{
    //1.take data from frontend
    const {username,email,fullname,password}=req.body;
    console.log(req.body);

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
   let avatarLocalPath= "";
   let coverImageLocalPath="";
   if(req.files&&Array.isArray(req.files.avatar) &&req.files.avatar.length>0)
   avatarLocalPath=req.files?.avatar[0]?.path;
   if(req.files&&Array.isArray(req.files.coverImage) &&req.files.coverImage.length>0)
   coverImageLocalPath=req.files?.coverImage[0]?.path;

   console.log(req.files);


   if(!avatarLocalPath) throw new apiError(400,"avater file is required");
   const avatar=await UploadonCloudinary(avatarLocalPath);
   const coverImage=await UploadonCloudinary(coverImageLocalPath);
   
   if(!avatar) throw new apiError(400,"avater file is required");

   //5.cteare objet of user -entry in db
   const user= await User.create({
    fullname, email,avatar:avatar.url,coverImage:coverImage?.url||"",password,username:username
   })
   //remove password and refreash token from response
   const createdUser= await User.findById(user._id).select("-password -refreshToken");
   if(!createdUser) throw new apiError(404,"something went wrong ! please try again");

   //return response
   return res.status(201).json(
    new apiResponse(200,createdUser,"user registred successfully")
   )
   


})

const loginUser=asyncHandler(async(req,res)=>{
    //take username or email,password
    const {username,email,password}=req.body
    // console.log(req.body);
    // console.log(username,password);
    if(!username && !email){
        throw new apiError(400,"username or email is required")
    }

    //find user
    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new apiError(400,"user not found")
    }

    //check validation
    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new apiError(401,"wrong password")
    }

    //genarate acess token
    const {refreshToken,accessToken}=await TokensGenarator(user._id)
    

    console.log(refreshToken);

    //send cookies
    const loggedUser= await User.findById(user._id).select("-password -refreshToken")
    // console.log(loggedUser);
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new apiResponse(
        202,
        {
            user:loggedUser
        }
    ,"User logged in successfully"

    ))
})

const logoutUser=asyncHandler(async(req,res)=>{
    //find user and update
    console.log(req.user);
   await User.findByIdAndUpdate(req.user._id,
        {
            refreashToken:undefined
        },
        {
            new:true
        })
    
    //delete cookies
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .clearCookie("accessToken",options) 
    .clearCookie("refreshToken",options)
    .json(
        new apiResponse(200,{},"user loggedout ! ")
    )
})

const RefreashAccessToken=asyncHandler(async(req,res)=>{
    try {
        // console.log(req.cookies);
        const RefreshToken=req.cookies?.refreshToken||req.header?.refreashToken;
        if(!RefreshToken) {
            throw new apiError(400,"unothrize request")
        }
        const decodedToken=jwt.verify(RefreshToken,process.env.REFRESH_TOKEN_SECRET);
        const user= await User.findById(decodedToken?._id);
        if(!user){
            throw new apiError(401,"invalid refresh token")
        }
        // console.log(user.refreshToken);
        if(user?.refreshToken!=RefreshToken) {
            throw new apiError(401,"refresh token is expired or used")
        }
        const {newAccessToken,newRefeshToken}= await TokensGenarator(user._id)
        const options={
            httpOnly:true,
            secure:true
        }
        return res.status(200)
        .cookie("refreshToken",newRefeshToken,options)
        .cookie("accessToken",newAccessToken,options)
        .json(
            new apiResponse(
                200,
                {
                    newAccessToken,newRefeshToken
                },
                "token refresh succesfully"
            )
        )
    } catch (error) {
        throw new apiError(404,error?.message||"something went wrong while refresh access token")
        
    }

})
export {registerUser,loginUser,logoutUser,RefreashAccessToken};