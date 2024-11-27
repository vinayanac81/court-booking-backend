import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  role: {
    type: Number,
    required: true,
    default: 1,
  },
  wallet: {
    type: Number,
  },
});

const userModel = mongoose.model("users", userSchema);
export default userModel;
