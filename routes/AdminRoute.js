import express from "express";
import { addNewCourt, addTime, deleteCourt, getStartDate, updateCourt } from "../controllers/adminController.js";
import multer from "multer";
import { adminAuth } from "../middlewares/authorization.js";
const router = express.Router();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/courts");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: fileStorage });
router.post("/add-court",adminAuth, upload.single("image"), addNewCourt);
router.delete("/handle-court",adminAuth,deleteCourt)
router.post("/add-slot",adminAuth,addTime)
router.get("/start-date",adminAuth,getStartDate)
router.post("/update-court",adminAuth,upload.single("image"),updateCourt)
export default router;
