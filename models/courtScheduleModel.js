import mongoose from "mongoose";

const courtScheduleSchema = mongoose.Schema({
  date: {
    type: Date,
    // required: true,
  },
  slot: {
    type: Object,
    // required: true,
  },
  cost: {
    type: Number,
  },
  bookedBy: {
    type: mongoose.Types.ObjectId,
    ref: "users",
  },
  cancellation: {
    type: Array,
  },
  courtId: {
    type: mongoose.Types.ObjectId,
    ref: "courts",
  },
  paymentOrders: {
    type: Array,
  },
});

const courtScheduleModel = mongoose.model("courtschedule", courtScheduleSchema);
export default courtScheduleModel;
