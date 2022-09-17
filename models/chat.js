const mongoose = require('mongoose')

const chatSChema = new mongoose.Schema({ 
    username: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
},
{
    timestamps: true
     
})

module.exports = mongoose.model('Chat', chatSChema)
