import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";
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
    
export  {userRouter};