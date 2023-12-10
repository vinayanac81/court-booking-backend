import express from "express";
import {
  bookedList,
  editEmail,
  editFirstName,
  editLastName,
  getAllCourtData,
  getDistrictData,
  getSingleCourtData,
  getSportsData,
  getTimeSlotData,
  updatePassword,
  updateProfilePic,
} from "../controllers/userController.js";
import { userAuth } from "../middlewares/authorization.js";
import multer from "multer";
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
router.get("/get-all-court-data", userAuth, getAllCourtData);
router.get("/get-single-court-data", userAuth, getSingleCourtData);
router.post(
  "/update-profile-image",
  userAuth,
  upload.single("profile"),
  updateProfilePic
);
router.get("/getTimeSlotData", userAuth, getTimeSlotData);
router.get("/get-booked-list", userAuth, bookedList);
router.post("/edit-first-name", userAuth, editFirstName);
router.post("/edit-last-name", userAuth, editLastName);
router.post("/edit-email", userAuth, editEmail);
router.post("/edit-password", userAuth, updatePassword);
router.get("/district",userAuth,getDistrictData)
router.get("/sports",userAuth,getSportsData)
export default router;
