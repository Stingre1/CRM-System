import fs from 'fs/promises';
import url from 'url';
import path from 'path';
import connectDB from './config/db.js';
import dotenv from 'dotenv'
import express from 'express';



//current path stuff
const __filename =  url.fileURLToPath(import.meta.url);
const __dirname =  path.dirname(__filename);
console.log(`dirname: ${__dirname}`)

dotenv.config(); 



const port = process.env.PORT;
console.log(port)


const app = express();

//setup static folder (middleware)
app.use(express.static(path.join(__dirname, 'client')))


app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})

connectDB()

