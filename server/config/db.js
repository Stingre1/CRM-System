import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv'
import colors from 'colors'


dotenv.config();
const uri = process.env.MONGO_URI;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const connectDB = async () => {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged. Successfully connected to MongoDB!"['green']);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`['red']);
  } finally {
    // Ensures that the client will close when you finish/error 
    await client.close();
  }
}


export default connectDB;
