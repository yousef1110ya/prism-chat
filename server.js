const express = require('express');
const app = express();
const chatRoutes = require('./routes/chatRoutes')
app.use(express.json());
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/auth');
dotenv.config();
connectDB();
const port = process.env.PORT || 3000;
const publicRouter = express.Router();


// getting the users data into the system 
publicRouter.route('/api/usersetting').get(authMiddleware , (req , res)=>{
    res.status(200).json(req.user);
});

// creating a new chat : 
app.use('/api/chat' , chatRoutes);


app.listen(port, console.log('server has started on port 3000'));