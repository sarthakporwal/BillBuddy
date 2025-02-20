const mongoose = require('mongoose');

const tempSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type: String,
        required:true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    cpassword:{
        type: String,
        required: true
    }
});

const tempCollection = new mongoose.model('tempCollection', tempSchema);

module.exports = tempCollection;