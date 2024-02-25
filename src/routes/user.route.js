import { Router } from "express";
import { RefreashAccessToken, changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, registerUser, updateUserAvatar } from "../controllers/user.controllers.js";
import{ upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter=Router();

    userRouter.route("/register").post(
        upload.fields([
            {
                name: "avatar",
                maxCount: 1
            }, 
            {
                name: "coverImage",
                maxCount: 1
            }
        ]),
        registerUser
        )
    userRouter.route("/login").post(loginUser) 
    userRouter.route("/logout").post(verifyJWT,logoutUser)
    userRouter.route("/refresh-token").post(RefreashAccessToken)
    userRouter.route("/change-password").post(verifyJWT,changeCurrentPassword)
    userRouter.route("/user").get(verifyJWT,getCurrentUser)
    userRouter.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
    userRouter.route("/c/:channel").get(verifyJWT,getUserChannelProfile)
    userRouter.route("/watch-history").get(verifyJWT,getWatchHistory)
export  {userRouter};