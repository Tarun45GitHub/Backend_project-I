import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
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
            required: true,
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
userSchema.plugin(mongooseAggregatePaginate)
export const User=mongoose.model("User",userSchema);