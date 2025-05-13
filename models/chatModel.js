const mongoose = require('mongoose');

const defaultGroupImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEsElEQVR4nO2bvW4TQRDGfxMxA24Am0BdgI1ADsA0oA7ANkA7gDWADegGdABdgXkFVZLR1VZtEvWktvt2Z9Yy1ubfnN1drYWzWakdU3MwFwOBwOByO2N8Dd+7yAD7Yboi1JQe8ARkCOAJTADsDbyZOSvgcJvAI2pJCdgBFyUNAdZfPvA1OEZgB+MRd7hdHbEvCSzEeFiAAwzAAXKOLkUMBgOm0dQBLxFZ8ShAXAksCyogUAF2K9mEDC6QFPCcBQ0KgmhXUgckKjEfcuIRkA1kaT1zAAQwsUuVJcKSQ0rY8yZ8JpDi7AGzPGYAmvP0vmlKeQEAJPLusxKmXgTYBy+cUv1eLXApgDwGbQj0FQnUgAfYfIjYCuAzNFXjWqVvCsGPM8lR0YZQ3hVgPVXJTZt0KJJk+9UUbAfLxYABqZ8Lb+ZmvFYGyzkoEXVvZmyQFzBeAT7BbNKnxeqUwgsAUwHgbi3PqpBDhPEpXug4L+AeAcdGAMM07fJwNMPC8GU5fK8By1mLVbDNZKcAZ2A3kM9AI3S7EVATsB0x5RI6uoIkZjFtx7CWAI4HSwOqVRdAVuAbECpfsNm1AJ+ixQPRdt9IakALyAF8BmgLZrq6o+6QEeBnbWjWuLgBsBRwFo3uRoLzN63jqJthOjghfTgHqwGPRgPZfg9aU08BdKp3XlcA9HdWVNXVPceGQHgFfP2Shn7O5AJr89uFdCEiTdo0Axz09y75LKAFgLsxqa5ypwrgCnKHo6ycv4WZ7BeAFUDjMNzNgFcuXWFeAYmVm0wK5TDYzZ9edUM0SHvQZTgWyxWc83KzG8AQnmlAZtkewNsAAAAASUVORK5CYII=";


const chatModel = mongoose.Schema(
    {
        chatName : {type:String , trim:true},
        isGroupChat : {type:Boolean , default:false},
        users:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        ],
        latestMessage:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message",
        },
        groupAdmin:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        ],
        groupImage: {
            type: String ,  // base64 formate
            default: defaultGroupImageBase64, // this is the default image 
        }
    },
    {
        timestamps: true,
    }
);

const Chat = mongoose.model("Chat" , chatModel);

module.exports = Chat;