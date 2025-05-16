const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');



const sendMessage = async (req,res) => {
    try {
        const {
            chat,
            messageType,
            text,
            mediaData,
            mediaContentType,
            mediaCaption
          } = req.body;
      
        const sender = req.user._id;

        // Validate inputs
        if (messageType === 'text' && !text) {
          return res.status(400).json({ error: 'Text is required for text messages' });
        }
    
        if (messageType !== 'text' && (!mediaData || !mediaContentType)) {
          return res.status(400).json({ error: 'mediaData and mediaContentType are required for media messages' });
        }
    
        // Create message obj
        const newMessage = new Message({
          sender,
          chat,
          messageType,
          text,
          mediaData,
          mediaContentType,
          mediaCaption
        });
    
        let savedMessage = await newMessage.save();
    
        // Populate sender and chat (including users and groupAdmin)
        savedMessage = await savedMessage.populate([
          { path: 'sender', model: User },
          {
            path: 'chat',
            model: Chat,
            populate: [
              { path: 'users', model: User },
              { path: 'groupAdmin', model: User }
            ]
          }
        ]);
    
        // Update latestMessage in the Chat
        await Chat.findByIdAndUpdate(chat, { latestMessage: savedMessage._id });
    
        res.status(201).json(savedMessage);
      } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
};


const allMessages = async (req, res) => {
    try {
      const { chatId } = req.params;
  
      const messages = await Message.find({ chat: chatId })
      .populate('sender', '-password') // Only populate sender
      .sort({ createdAt: 1 }); // Sort by oldest first

  
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  };



module.exports = {sendMessage , allMessages };