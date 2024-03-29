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

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }