import mongoose from "mongoose";

const courtSchema = mongoose.Schema({
  court_name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  disable: {
    type: Boolean,
  },
  address: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  court_image: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: new Date(),
  },
});

const courtModel = mongoose.model("courts", courtSchema);
export default courtModel;
