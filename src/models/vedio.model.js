import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const vedioSchema=new Schema(
    {
        vedioFile:{
            type:String,
            required:true
        },
        thumbnail:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        }, owner:{
            type: Schema.Types.ObjectId,
            ref:"User"
        },
        duration:{
            type:Number,
            required:true
        },viwes:{
            type:Number,
            required:true,
            default:0
        },isPublished:{
            type:Boolean,
            default:true,
            required:true
        }
    },{timestamps:true})
vedioSchema.plugin(mongooseAggregatePaginate)
export const Vedio= mongoose.model("Vedio",vedioSchema);