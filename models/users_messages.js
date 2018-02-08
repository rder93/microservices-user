const mongoose = require('mongoose');

var Users = mongoose.model('Users');

const UsersMessagesSchema = new mongoose.Schema({
    subject:{
    	type: String,
    	required: true
    },
    message: {
        type: String,
        required: true
    },
    service : {
        _id: mongoose.Schema.Types.ObjectId,
        title:{
            type: String
        },
        description:{
            type: String
        },
        price:{
            type: String
        },
        img: { 
            type: String,
            default: null
        },
        user: {
            _id: mongoose.Schema.Types.ObjectId,
            name: String,
            phone: String,
            reputation: {
                type: Number,
                default: 0
            },
            address: String
        }
    },
    postedBy:{ 
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        phone: String,
        reputation: {
            type: Number,
            default: 0
        },
        address: String 
    } 
});

const UsersMessages = module.exports =  mongoose.model('UsersMessages', UsersMessagesSchema);