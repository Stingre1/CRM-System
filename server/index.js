import fs from 'fs/promises';
import url from 'url';
import path from 'path';
import connectDB from './config/db.js';
import dotenv from 'dotenv';


//current path stuff
const __dirname =  path.dirname(__filename);
const __filename =  url.fileURLToPath(import.meta.url);
console.log(`${__dirname + "\\.env"}`)
dotenv.config({ path: path.resolve(__dirname + '\\.env') });  // Ensure correct path is loaded







// console.log(`${__filename} \n ${__dirname}`)

connectDB()

console.log(`End`)