const mongoose = require('mongoose')

const roomUserSchema = new mongoose.Schema({ 
    username:{
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    socketId: {
        type: String,
        required: true
    },    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

},
{
    timestamps: true
     
})

module.exports = mongoose.model('RoomUser', roomUserSchema)
