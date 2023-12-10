import { userAuth } from "../middlewares/authorization.js"
import express from "express"
import { order, success } from "../controllers/paymentController.js"

const router=express.Router()

router.post("/order",userAuth,order)
router.post("/success",userAuth,success)

export default router