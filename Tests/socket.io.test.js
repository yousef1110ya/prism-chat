// test-client.js
const { io } = require('socket.io-client');
const axios = require('axios');

const socket = io('http://localhost:3000');
const USER_A = 1;
const CHAT = '6823b6621728bb08649f9111';
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzQ3NDIxMTI5LCJleHAiOjE3NDc0MjQ3MjksIm5iZiI6MTc0NzQyMTEyOSwianRpIjoiRUp3eXc5bThvc1loNUtvYiIsInN1YiI6IjIiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3IiwibmFtZSI6InByaXZhdGUiLCJlbWFpbCI6ImJlc3Rwcm95b3VzZWY5OUBnbWFpbC5jb20ifQ.shTIT4mQvQ5TpcSip5h67nXKGIEidlbPMuk_lWhVddg';


socket.on('connect', () => {
  socket.emit('setup', { mainId: USER_A });
  socket.emit('join room', CHAT);

//   Send via HTTP then via socket
  axios.post('http://localhost:3000/api/message',{
    "chat": CHAT,
    "messageType": "text",
    "text": "welcome to the first message via socket.io"
  },{ headers: { Authorization: `Bearer ${token}` } }).then(res => {
    socket.emit('new message', {
        "chat": res.data.chat,
        "sender": res.data.sender,
        "message":res.data
      });
  });
});

socket.on('message recived', msg => {
  console.log('⏳ Received:', msg);
});
