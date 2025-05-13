const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = async (req, res) => {
  try {
    const myMainId = req.user.mainId; // from auth middleware
    const otherMainId = req.body.mainId; // from request payload

    console.log(myMainId);
    console.log(otherMainId);

    // Find both users by mainId
    const [me, otherUser] = await Promise.all([
      User.findOne({ mainId: myMainId }),
      User.findOne({ mainId: otherMainId }),
    ]);

    if (!me || !otherUser) {
      return res.status(404).json({ message: 'One or both users not found' });
    }

    // Find existing one-on-one chat that includes both users
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [me._id, otherUser._id] },
    })
      .populate('users', '-password')
      .populate('latestMessage');

    if (chat) {
      chat = await User.populate(chat, {
        path: 'latestMessage.sender',
        select: 'name',
      });

      console.log('Found the existing chat with that user:');
      console.log(chat);
      return res.status(200).json(chat);
    }

    // No chat found, create a new one
    const chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [me._id, otherUser._id],
    };

    const createdChat = await Chat.create(chatData);

    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      'users',
      '-password'
    );

    return res.status(200).json(fullChat);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const fetchChats = async (req , res) => {
  const mainId = req.user.mainId;
  try {
    const user = await User.findOne({ mainId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    Chat.find({ users: { $elemMatch: { $eq: user._id } } })
  .populate('users', '-password')
  .populate('groupAdmin', '-password')
  .populate({
    path: 'latestMessage',
    populate: {
      path: 'sender',
      model: 'User',
      select: 'username  mainId', // Add other fields you need
    },
  })
  .sort({ updatedAt: -1 })
  .then((chats) => {
    res.send(chats);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch chats', error: err.message });
  });


    } catch (error) {
    
  }
  
}


const createGroupChat = async (req, res) => {
  try {
    const { name, userMainIds } = req.body; // `userMainIds` is an array of mainIds
    const currentUser = req.user; // assuming middleware sets this

    // if (!name || !Array.isArray(userMainIds) || userMainIds.length === 0) {
    //   return res.status(400).json({ message: 'Group name and user list are required' });
    // }

    // Fetch users by mainId
    const users = await User.find({ mainId: { $in: userMainIds } });

    // Fetch current user by mainId
    const currentUserDoc = await User.findOne({ mainId: currentUser.mainId });
    if (!currentUserDoc) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    // Include current user in the chat user list if not already present
    const userIds = users.map(user => user._id.toString());
    if (!userIds.includes(currentUserDoc._id.toString())) {
      users.push(currentUserDoc);
    }

    // Create the group chat
    const groupChat = await Chat.create({
      chatName: name,
      isGroupChat: true,
      users: users.map(user => user._id),
      groupAdmin: [currentUserDoc._id],
    });

    // Populate the created chat with user and admin info
    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate('users', 'username profileImage mainId')
      .populate('groupAdmin', 'username profileImage mainId');

    res.status(201).json(fullGroupChat);
  } catch (error) {
    console.error('Group chat creation failed:', error);
    res.status(500).json({ message: 'Failed to create group chat', error: error.message });
  }
};




module.exports = {accessChat , fetchChats , createGroupChat}