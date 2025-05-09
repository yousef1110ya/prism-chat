const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'video', 'voice'],
    },
    text: {
      type: String,
      required: function() { return this.messageType === 'text'; }
    },
    mediaData: {
      type: String,
      required: function() { return this.messageType !== 'text'; }
    },
    mediaContentType: {
      type: String,
      required: function() { return this.messageType !== 'text'; }
    },
    mediaCaption: {
      type: String
    }
}, { timestamps: true });
  
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;