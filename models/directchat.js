const mongoose = require('mongoose')

const directChat = new mongoose.Schema({ 
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

module.exports = mongoose.model('directChat', directChat)
