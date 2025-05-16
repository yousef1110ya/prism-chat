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

module.exports = {io};

io.on('connection',(socket) =>{
    console.log('connected to the socket.io server');

    // for connecting to the socket.io server
    socket.on('setup', async (userData)=>{
        console.log('connect to setup with the userData of '+userData.mainId);
        const user = await User.findOne({ mainId: userData.mainId }).select('-password');
        socket.join(user._id);
        socket.emit("connected");
    });

    // for joining the room server 
    socket.on('join room' , (room)=>{
        socket.join(room);
        console.log("user joind room " + room); 
    });

    // for sending a new message ( the front end will send the message using the api and then emmit this event)
    socket.on('new message' , (newMessageRecived)=>{
        var chat = newMessageRecived.chat;
        if(!chat.users) return console.log('chat.users is not defined ');

        chat.users.forEach(user => {
            // don't send the message to the user 
            if(user._id === newMessageRecived.sender._id) return ;
            

            // this event is only for the front end to listen to 
            socket.in(user._id).emit("message recived" , newMessageRecived);
        });
    });

    /**
     * this code indecates that the user is inside a chat room and typing 
     * and it's toggled by the front end with no interfeare from the back end 
     */
    socket.on("start typing" , (room)=>socket.in(room).emit("start typing"));
    socket.on("stop typing" , (room)=>socket.in(room).emit("stop typing"));

    // leaving the socket in the end to save some bandwidth 
    socket.off("setup",()=>{
        socket.leave(userData._id);
    })
});