const mongoose = require('mongoose');

const tempSchema = new mongoose.Schema({
    expense:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    }
});

var expenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    expense: [tempSchema]
});

const Expenses = mongoose.model('userExpense', expenseSchema);
module.exports = Expenses;
