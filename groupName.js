const mongoose = require('mongoose');

const groupNameSchema = new mongoose.Schema({
    name: {
        type: String
    }
});

module.exports = mongoose.model('GroupName', groupNameSchema);