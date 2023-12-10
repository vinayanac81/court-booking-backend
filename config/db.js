import mongoose from "mongoose";

const connect = async () => {
    try {
      const connection = await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
      });
      console.log("Database Connected");
    //   console.log(process.env.MONGODB_URL);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }
  

export default connect