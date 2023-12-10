import courtModel from "../models/courtModel.js";
import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import courtScheduleModel from "../models/courtScheduleModel.js";
const ObjectId = mongoose.Types.ObjectId;
import bcrypt from "bcrypt"
export const getAllCourtData = async (req, res) => {
  try {
    console.log(req.query.role);
    if(req.query.role==="1"){
      console.log("OK");
      const court = await courtModel.find({});
      return res.status(200).json({ court, success: true });
    }else{
      const court = await courtModel.find({disable:false});
      return res.status(200).json({ court, success: true });
    }
    
  } catch (error) {
    console.log(error);
  }
};
export const getSingleCourtData = async (req, res) => {
  try {
    const { id } = req.query;
    const court = await courtModel.findOne({ _id: new ObjectId(id) });
    res.json({ success: true, court });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const { userId } = req.query;

    const file = req?.file?.filename;
    await userModel.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          image: file,
        },
      }
    );
    const user = await userModel.findOne({ _id: new ObjectId(userId) });
    res.json({ success: true, message: "Profile Pic Updated...", user });
  } catch (error) {
    console.log(error);
  }
};
export const getTimeSlotData = async (req, res) => {
  try {
    // console.log(req.query);
    let searchDate = new Date(req.query.date).toString().slice(0, 15);
    let todayDate = new Date().toString().slice(0, 15);
    // console.log(todayDate, searchDate);
    if (todayDate === searchDate) {
      // console.log("IG");
      let currentHour = new Date().getHours();
      // console.log(currentHour);
      let currentDate = new Date(
        new Date(req.query.date).setUTCHours(0, 0, 0, 0)
      );
      const data = await courtScheduleModel.aggregate([
        {
          $match: {
            courtId: new ObjectId(req.query.courtId),
            date: currentDate,
            "slot.id": { $gt: currentHour },
          },
        },
        { $sort: { "slot.id": 1 } },
        {
          $lookup: {
            from: "courts",
            localField: "courtId",
            foreignField: "_id",
            as: "court",
          },
        },
        {
          $project: {
            court: { $arrayElemAt: ["$court", 0] },
            _id: 1,
            date: 1,
            slot: 1,
            bookedBy: 1,
            cost: 1,
          },
        },
      ]);
      return res.json({ success: true, data });
    }
    // let currentHour = new Date(req.query.date).getHours();
    // console.log(currentHour);
    let currentDate = new Date(
      new Date(req.query.date).setUTCHours(0, 0, 0, 0)
    );
    let currentHour = new Date(currentDate).getHours();
    console.log(currentHour);
    console.log(currentDate);
    const data = await courtScheduleModel.aggregate([
      {
        $match: {
          courtId: new ObjectId(req.query.courtId),
          date: currentDate,
          "slot.id": { $gt: currentHour },
        },
      },
      { $sort: { "slot.id": 1 } },
      {
        $lookup: {
          from: "courts",
          localField: "courtId",
          foreignField: "_id",
          as: "court",
        },
      },
      {
        $project: {
          court: { $arrayElemAt: ["$court", 0] },
          _id: 1,
          date: 1,
          slot: 1,
          bookedBy: 1,
          cost: 1,
        },
      },
    ]);
    res.json({ success: true, data });
  } catch (error) {
    console.log(error);
  }
};
export const bookedList = async (req, res) => {
  try {
    const { userId } = req.body;
    // var s = new Date().toLocaleDateString(undefined, {
    //   timeZone: "Asia/Kolkata",
    // });
    // console.log(new Date(s));
    let currentDate = new Date();
    console.log(currentDate);
    const slotHour = currentDate.getHours();
    currentDate.setUTCHours(0, 0, 0, 0);
    if (
      slotHour === 0 ||
      slotHour === 1 ||
      slotHour === 2 ||
      slotHour === 3 ||
      slotHour === 4
    ) {
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }
    console.log(currentDate, slotHour);
    const list = await courtScheduleModel.aggregate([
      {
        $match: {
          bookedBy: new ObjectId(userId),
          $expr: {
            $or: [
              { $gt: ["$date", currentDate] },
              {
                $and: [
                  { $eq: ["$date", currentDate] },
                  { $gte: ["$slot.id", slotHour] },
                ],
              },
            ],
          },
        },
      },
      {
        $lookup: {
          from: "courts",
          localField: "courtId",
          foreignField: "_id",
          as: "court",
        },
      },
      {
        $project: {
          _id: 1,
          date: 1,
          slot: 1,
          cost: 1,
          courtData: { $arrayElemAt: ["$court", 0] },
        },
      },
    ]);
    // console.log(list, list.length);
    res.json({ success: true, list });
  } catch (error) {
    console.log(error);
  }
};
export const editFirstName = async (req, res) => {
  try {
    await userModel.updateOne(
      { _id: new ObjectId(req.body.userId) },
      {
        $set: {
          first_name: req.body.editedFirstName,
        },
      }
    );
    const user = await userModel.findOne({
      _id: new ObjectId(req.body.userId),
    });
    res.json({success:true,user})
  } catch (error) {
    console.log(error);
  }
};
export const editLastName = async (req, res) => {
  try {
    await userModel.updateOne(
      { _id: new ObjectId(req.body.userId) },
      {
        $set: {
          last_name: req.body.editedLastName,
        },
      }
    );
    const user = await userModel.findOne({
      _id: new ObjectId(req.body.userId),
    });
    res.json({success:true,user})
  } catch (error) {
    console.log(error);
  }
};
export const editEmail = async (req, res) => {
  try {
    await userModel.updateOne(
      { _id: new ObjectId(req.body.userId) },
      {
        $set: {
          email: req.body.editedEmail,
        },
      }
    );
    const user = await userModel.findOne({
      _id: new ObjectId(req.body.userId),
    });
    res.json({success:true,user})
  } catch (error) {
    console.log(error);
  }
};

export const updatePassword = async (req, res) => {
  try {
    let { newPass, oldPass } = req.body.password;
    const userData = await userModel.findOne({
      _id: new ObjectId(req.body.userId),
    });
    if (userData.password === undefined) {
      console.log(req.body.password);
      newPass = await bcrypt.hash(newPass, 12);
      await userModel.updateOne(
        {
          _id: new ObjectId(req.body.userId),
        },
        {
          $set: {
            password: newPass,
          },
        }
      );
      res.json({ success: true, message: "Password Updated Successfully" });
    } else {
      let correct = await bcrypt.compare(oldPass, userData.password);
      console.log(correct);
      if (correct) {
        newPass = await bcrypt.hash(newPass, 12);
        await userModel.updateOne(
          {
            _id: new ObjectId(req.body.userId),
          },
          {
            $set: {
              password: newPass,
            },
          }
        );
        res.json({ success: true, message: "Password Updated Successfully" });
      } else {
        res.json({
          success: false,
          passwordError: true,
          message: "Old Password Is Incorrect",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
export const getDistrictData=async(req,res)=>{
  try {
    console.log(req.query);
    const data=await courtModel.find({district:req.query.district})
    res.json({success:true,district:data})
  } catch (error) {
    console.log(error);
  }
}
export const getSportsData=async(req,res)=>{
  try {
    const data=await courtModel.find({type:req.query.sports})
    res.json({success:true,sports:data})
  } catch (error) {
    console.log(error);
  }
}