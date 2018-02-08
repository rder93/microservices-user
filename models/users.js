const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: String,
        required: true
    },
    address:{
        type: String
    },
    reputation:{
        type: Number,
        default: null
    }
});

const Users = module.exports =  mongoose.model('Users', UsersSchema);