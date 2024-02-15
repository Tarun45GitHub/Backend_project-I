import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import  jwt from "jsonwebtoken";

const userSchema= new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim:true,
            indexed:true
        },
        email: {
            type: String,
            // required: true,
            unique: true,
            lowercase: true,
            trim:true
        },fullname:{
            type: String,
            required: true,
            trim:true,
            indexed:true
        },avatar: {
            type:String, //cloudinary url
            required:true,
        },coverImage:{
            type:String, //cloudinary url
        },watchHistory :[
            {
                type:Schema.Types.ObjectId,
                ref:"Vedio"
            }
        ], password: {
            type: String,
            required: true,
        },refreshToken: {
            type:String
        }
        
    },{timestamps:true})

    userSchema.pre('save',async function(next){
        if(this.isModified("password")){
            this.password= await bcrypt.hash(this.password,10);
            next();
        }
    })
    userSchema.methods.isPasswordCorrect=async function(password){
         return await bcrypt.compare(password,this.password);
    }
    userSchema.methods.AccessTokenGenarate=async function(){
        return jwt.sign(
            {
                _id:this._id,
                email:this.email,
                username:this.username
            },process.env.ACCESS_TOKEN_SECRET
            ,{
                expiresIn:process.env.ACCESS_TOKEN_EXPIRY
            }
        )
    }
    userSchema.methods.AccessTokenGenarate=async function(){
        return jwt.sign(
            {
                _id:this._id,

            },process.env.REFRESH_TOKEN_SECRET
            ,{
              expiresIn:process.env.REFRESH_TOKEN_EXPIRY
            }
        )
    }

export const User=mongoose.model("User",userSchema);