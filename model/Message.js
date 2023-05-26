const { Schema, model } = require('mongoose')

const schema = new Schema({  
    id:
    {
        type: Number,
        required: true
    },
    msg:
    {
        type: String
    },
    images:
    {
        type: Array,
        default: []
    },
    author:
    {
        type: Object,
        required: true
    },
    time:
    {
        type: Date,
        default: Date.now
    },
    reply:
    {
        type: Object,
        default: {}
    }
})

module.exports = model('Message', schema)