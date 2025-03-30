import { Router } from "express";
import { loginUser, registerUser , logoutUser, getUserById, validateToken, getAllUsers, updateStatus } from "../controllers/user.controller.js";
import { authUser } from "../middlewares/authUser.middleware.js";

const router = Router()

router.post("/register" , registerUser)
router.post("/login" , loginUser)
router.get("/logout" , authUser , logoutUser)
router.get("/get-user/:userId" , authUser , getUserById)
router.get("/validate-token" , validateToken)
router.get("/get-users" , authUser , getAllUsers)
router.get("/update-status/:userId"  , updateStatus)

export default router