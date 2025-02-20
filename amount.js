const mongoose = require('mongoose');

const amountSchema = new mongoose.Schema({
    amount: {
        type: Number
    }
});

module.exports = mongoose.model('Amount', amountSchema);