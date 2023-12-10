import courtModel from "../models/courtModel.js";
import mongoose from "mongoose";
import courtScheduleModel from "../models/courtScheduleModel.js";
const ObjectId = mongoose.Types.ObjectId;
export const addNewCourt = async (req, res) => {
  try {
    let { name, place, district, address, number, category } = req.query;
    number = parseInt(number);
    place = place.toLowerCase();
    district = district.toLowerCase();
    category = category.toLowerCase();
    await courtModel.create({
      court_name: name,
      location: place,
      type: category,
      address: address,
      district: district,
      number: number,
      court_image: req.file.filename,
    });
    return res.json({ success: true, message: "Court added successfully" });
  } catch (error) {
    console.log(error);
  }
};
export const deleteCourt = async (req, res) => {
  try {
    console.log(req.query.id, req.query.disable);
    if (req.query.disable === "true") {
      await courtModel.updateOne(
        { _id: new ObjectId(req.query.id) },
        {
          disable: true,
        }
      );
      res.json({ success: true });
    } else {
      await courtModel.updateOne(
        { _id: new ObjectId(req.query.id) },
        {
          disable: false,
        }
      );
      res.json({ success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
export const addTime = async (req, res) => {
  try {
    const { cost, selectedTimings, courtId, endDate, startDate, adminId } =
      req.body;
    // console.log(req.body);
    // console.log(startDate, endDate);
    let currentDate;
    let lastDate = new Date(endDate);
    currentDate = new Date(startDate);
    // console.log(currentDate,lastDate);
    const slotObj = [];
    currentDate = new Date(new Date(currentDate).setUTCHours(0, 0, 0, 0));
    // console.log(currentDate, lastDate);
    while (currentDate <= lastDate) {
      // console.log("K");
      for (let data of selectedTimings) {
        slotObj.push({
          date: JSON.parse(JSON.stringify(currentDate)),
          slot: {
            name: data.name,
            id: data.id,
          },
          cost: cost,
          courtId,
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    await courtScheduleModel.insertMany(slotObj);
    res.json({ success: true, message: "time slots added successfully" });
  } catch (error) {
    console.log(error);
  }
};
export const getStartDate = async (req, res) => {
  try {
    const court = await courtScheduleModel
      .findOne({ courtId: req.query.id })
      .sort({ date: -1 })
      .limit(1)
      .select("date");
    // console.log(court);
    if (court) {
      const date = court.date;
      res.json({ date });
    }
  } catch (error) {
    console.log(error);
  }
};
export const updateCourt = async (req, res) => {
  try {
    const { singleCourtData, imageUploaded, courtId } = req.query;
    console.log(req.query);
    if (imageUploaded === "true") {
      await courtModel.updateOne(
        { _id: new ObjectId(courtId) },
        {
          $set: {
            court_name: singleCourtData.court_name,
            court_image: singleCourtData.court_image,
            address: singleCourtData.address,
            number: singleCourtData.number,
            court_image: req.file.filename,
          },
        }
      );
      res.status(200).json({ success: true, message: "Court updated" });
    } else {
      await courtModel.updateOne(
        { _id: new ObjectId(courtId) },
        {
          $set: {
            court_name: singleCourtData.court_name,
            court_image: singleCourtData.court_image,
            address: singleCourtData.address,
            number: singleCourtData.number,
          },
        }
      );
      res.status(200).json({ success: true, message: "Court updated" });
    }
  } catch (error) {
    console.log(error);
  }
};
