const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true,
        min: 2,
        max: 20
    },
    password:
    {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    date:
    {
        type: Date,
        default: Date.now
    },
    avatar:
    {
        type: String,
        required: true
    },
    ip:
    {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);