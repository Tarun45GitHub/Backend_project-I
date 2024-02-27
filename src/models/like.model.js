import mongoose, { Schema } from "mongoose";

const likeSchema=new Schema({
    comment:{
        type:Schema.Types.ObjectId,
        ref:"Comment"
    },
    vedio:{
       type:Schema.Types.ObjectId,
       ref:"Vedio" 
    },
    likeBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    twitter:{
        type:Schema.Types.ObjectId,
        ref:"twitter"
    }
},{timestamps:true})

export const Like=mongoose.Schema("Like",likeSchema);