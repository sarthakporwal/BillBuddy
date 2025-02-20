const mongoose = require('mongoose');

const groupNameSchema = new mongoose.Schema({
    name: {
        type: String
    }
});

const userGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    groups: [groupNameSchema]
});
module.exports = mongoose.model('userGroup', userGroupSchema);