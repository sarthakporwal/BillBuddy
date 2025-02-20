const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    shares:{
        type:String,
        required:true
    }
});

const stocksSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    shares: [stockSchema]
});

const Share = new mongoose.model('Shares', stocksSchema);
module.exports = Share;