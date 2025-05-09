const mongoose = require('mongoose');

const userSchema = mongoose.Schema({// all of this data is taken from the jwt token provided from the main service 
    username :{type:String , trim:true},
    mainId:{type: Number, required: true},// the Id from the laravel service ( taken from the jwt )
    profileImage : {type:String}, // this one is an image url from the laravel service ( pulled after getting the user from the jwt) 
}, {timestamps : true});
const User = mongoose.model("User" , userSchema);
module.exports = User;