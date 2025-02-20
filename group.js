const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    name: {
        type: String
    }
});

const amountSchema = new mongoose.Schema({
    amount: {
        type: Number
    }
});

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    participants: [participantSchema],
    amount: [amountSchema]
});

module.exports = mongoose.model('expenseGroup', groupSchema);