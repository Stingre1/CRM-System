import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();
const uri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Optional: Adjust timeout
    });

    console.log("Pinged. Successfully connected to MongoDB!"['green']);
    console.log(`Mongoose connection status: ${mongoose.connection.readyState}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`['red']);
    process.exit(1); // Exit the process on failure
  }
};

export default connectDB;
