import courtScheduleModel from "../models/courtScheduleModel.js";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import crypto from "crypto";
import nodemailer from "nodemailer";
const ObjectId = mongoose.Types.ObjectId;
export const order = async (req, res) => {
  console.log(req.query.slotId);
  const data = await courtScheduleModel.findOne({
    _id: new ObjectId(req.query.slotId),
  });
  let cost = parseInt(data.cost);
  console.log(data?.paymentOrders.length);
  let slotBooked = data?.paymentOrders.length;
  if (slotBooked > 0) {
    res.json({ sucess: true, message: "Slot already booked" });
  } else {
    try {
      const instance = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET,
      });
      const options = {
        amount: cost * 100,
        currency: "INR",
        receipt: req.query.slotId,
      };
      const order = await instance.orders.create(options);
      if (!order) return res.json("Some error occured");
      res.json({ success: true, order });
    } catch (error) {
      console.log(error);
    }
  }
};
export const success = async (req, res) => {
  try {
    const sendEmail = async (id, paymentId) => {
      const slotData = await courtScheduleModel
        .findOne({ _id: new ObjectId(id) })
        .populate("bookedBy").populate("courtId")

      console.log(slotData);
      //nodemailer
      const transporter = nodemailer.createTransport({
        host: "smtp.forwardemail.net",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: "vinudev2689@gmail.com",
          pass: "gqpe ihzw bxvv srhf",
        },
      });

      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Fred Foo 👻" <foo@example.com>', // sender address
          to: "bar@example.com, baz@example.com", // list of receivers
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body
          html: "<b>Hello world?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        //
        // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
        //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
        //       <https://github.com/forwardemail/preview-email>
        //
      }

      main().catch(console.error);
    };

    // getting the details back from our font-end

    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      slotId,
    } = req.body.data;

    // Creating our own digest
    // The format should be like this:
    // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const shasum = crypto.createHmac("sha256", process.env.KEY_SECRET);

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    // comaparing our digest with the actual signature
    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
    await courtScheduleModel.updateOne(
      { _id: new ObjectId(slotId) },
      {
        $set: { bookedBy: req.body.userId },
        $push: {
          paymentOrders: {
            user_id: req.body.userId,
            razorpayPaymentId,
            timeStamp: new Date(),
          },
        },
      }
    );
    //  await sendEmail(slotId, razorpayPaymentId);
    res.json({
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
