import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path  from 'path';
import connect from "./config/db.js";
import UserRoute from "./routes/UserRouter.js";
import AdminRoute from "./routes/AdminRoute.js";
import authRoute from "./routes/AuthRouter.js"
import paymentAuth from "./routes/paymentAuth.js"
import { fileURLToPath } from 'url';
const app = express();

dotenv.config();
connect();
const PORT = process.env.PORT || 5000;
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors({ origin:"https://court-booking-frontend.onrender.com"}));
app.use(cors({origin:"http://localhost:5173"}));
// app.use("/", userRoute);
app.use("/auth", authRoute);
app.use("/admin",AdminRoute)
app.use("/user",UserRoute)
app.use("/payment",paymentAuth)
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
