const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
dotenv.config();
connectDB();
const port = process.env.PORT || 3000;


app.listen(port, console.log('server has started on port 3000'));