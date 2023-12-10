import userModel from "../models/userModel.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const doSignup = async (req, res) => {
  try {
    const { signupData } = req.body;
    const email = await userModel.findOne({ email: signupData.email.toLowerCase() });
    if (email) {
      return res.status(200).json({
        message: "Email already exist",
        emailExist: true,
        success: false,
      });
    }
    signupData.password = await bcrypt.hash(signupData.password, 10);
    await userModel.create({
      first_name: signupData.fName,
      last_name: signupData.lName,
      email: signupData.email.toLowerCase(),
      password: signupData.password,
      image: "",
    });
    res.status(200).json({ success: true, message: "Signup Successfully" });
  } catch (error) {
    console.log(error);
  }
};
export const doLogin = async (req, res) => {
  try {
    const { loginData } = req.body;
    const email = await userModel.findOne({ email: loginData.email.toLowerCase() });
    if (!email) {
      return res.status(200).json({
        success: false,
        noEmail: true,
        message: "Email id not exist, Please Signup",
      });
    }
    bcrypt.compare(loginData.password, email.password).then((status) => {
      if (status) {
        const token = jwt.sign(
          {
            _id: email?._id,
            email: email?.email,
            first_name: email?.first_name,
            last_name: email?.last_name,
            role: email?.role,
            wallet: email?.wallet,
            image: email?.image,
          },
          process.env.JWT_SECRET ?? "vinayan",
          {
            expiresIn: "1d",
          }
        );
        email.password = undefined;
        return res.json({
          token,
          user: email,
          success: true,
          message: "Login Successfully",
        });
      } else {
        return res.json({
          success: false,
          passError: true,
          message: "Password error",
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
