import express from "express"
import { doLogin, doSignup } from "../controllers/authController.js"
const router=express.Router()
router.post("/signup",doSignup)
router.post("/login",doLogin)
export default router