const mongoose  = require('mongoose');

const profileSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    income:{
        type:Number,
        required:true

    },
    contact:{
        type:Number,
        requred:true
    },
    currency:{
        type:String,
        required:true
    }
});



const profileCollection  = new mongoose.model('profileCollection', profileSchema);

module.exports = profileCollection;