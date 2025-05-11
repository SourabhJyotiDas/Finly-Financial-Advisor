import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const connnection = {};

export const connectToDatabase = async () => {
   if (connnection.isConnected) {
      console.log("Already connected to database");
      return;
   };
   try {
      const db = await mongoose.connect(process.env.MONGODB_URI);

      connnection.isConnected = db.connections[0].readyState;

      console.log("Database connected successfully");
   } catch (error) {
      console.log("Database connection failed", error);
      process.exit(1);
   }
};

