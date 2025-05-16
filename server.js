const express = require('express');
const app = express();
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
app.use(express.json());
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/auth');
dotenv.config();
connectDB();
const port = process.env.PORT || 3000;
const publicRouter = express.Router();
const User = require('./models/userModel');

// getting the users data into the system 
publicRouter.route('/api/usersetting').get(authMiddleware , (req , res)=>{
    res.status(200).json(req.user);
});

// creating a new chat : 
app.use('/api/chat' , chatRoutes);
app.use('/api/message' , messageRoutes);


const server = app.listen(port, console.log('server has started on port 3000'));

const io = require('socket.io')(server,{
    pingTimout:60000,
    cors:{
        origin:'*',
    },
});

io.on('connection',(socket) =>{
    console.log('connected to the socket.io server');

    socket.on('setup', async (userData)=>{
        console.log('connect to setup ');
        const user = await User.findOne({ mainId: userData.mainId }).select('-password');
        socket.join(user._id);
        socket.emit("connected");
    });

    socket.on('join-chat' , (room)=>{
        socket.join(room);
        console.log("user joind room " + room); 
    });
});