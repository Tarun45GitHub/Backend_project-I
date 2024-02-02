// const asyncHandler=(fn)=>{async(req,res,nex)=>{
//     try {
//         await fn(req,res,nex);
//     } catch (err) {
//         res.ststus(err.code||404).json({
//             sucess:false,
//             message:err.message,
//         })
//     }
// }}

const asyncHandler=(fn)=>{
    (req,res,nex)=>{
        Promise.resolve(asyncHandler(req,res,nex)).catch((err)=>nex(err))
    }
}

export {asyncHandler};