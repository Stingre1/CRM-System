import fs from 'fs/promises';
import url from 'url';
import path from 'path';
import connectDB from './config/db.js';
import dotenv from 'dotenv'
import express from 'express';
import colors from 'colors';

//current path stuff
const __filename =  url.fileURLToPath(import.meta.url);
const __dirname =  path.dirname(__filename);

dotenv.config(); 

const port = process.env.PORT;


const app = express();
app.listen(port, () => {
    console.log(`Server running on port: ${port}`['green'])
})

connectDB()

//setup static folder (middleware)
app.use(express.static(path.join(__dirname, 'client')))




