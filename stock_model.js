const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    shares:{
        type:String,
        required:true
    }
});

const Stock = new mongoose.model('StockName', stockSchema);
module.exports = Stock;