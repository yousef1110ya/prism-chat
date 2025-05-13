const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { accessChat , fetchChats , createGroupChat} = require('../controllers/chatController');


router.route('/').post(authMiddleware , accessChat);
router.route('/uesr').get(authMiddleware , (req , res)=>{ 
    res.status(200).json(req.user);
});
router.route('/').get(authMiddleware ,fetchChats);
router.route('/group').post(authMiddleware , createGroupChat);
// router.route('/rename').put(authMiddleware ,renameGroup);
// router.route('/groupremove').put(authMiddleware ,removeFromGroup);
// router.route('/groupadd').put(authMiddleware ,addToGroup);

module.exports = router;