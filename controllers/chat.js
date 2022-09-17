const IO = require('../socket')
const RoomUser = require('../models/roomusers')
const User = require('../models/user')
const Chat = require('../models/chat')
const {formatMessage, formatAllchats} = require('../utils/format-message')



exports.getIndex = async (req,res,next) => {
    res.render('index')
}

exports.getJoinRoom = async (req,res,next) => {
    res.render('joinroom', {username: req.user.username})
}

exports.getChat = async(req,res,next) => {
    // const BOTNAME = 'Gist Bot'
    // const io = IO.getIO()
    // io.on('connection', socket => {
    //     let user
    //     socket.on('joinRoom', async ({username, room})=> {
    //         // console.log(username)
    //         // // console.log(existingUser)\
    //         // if(existingUser){
    //             //     console.log('User already exists')
    //             // }
    //         const existingUser = await RoomUser.findOne({username: username})
    //         const authUser = await User.findOne({username: username})
    //         user = new RoomUser({
    //             username: username,
    //             room: room,
    //             socketId: socket.id,
    //             userId: authUser
    //         })
    //         await user.save()

    //         console.log('createdUser', user.username)

    //         //User Join Room
    //         socket.join(user.room)

    //         const allChats = await Chat.find({room: user.room}).limit(100).sort({ createdAt: 'asc'}).exec()
    //         const formattedChats = formatAllchats(allChats)
    //         socket.emit('allChats', formattedChats)

    //         //Welcome current user
    //         socket.emit('message', formatMessage(BOTNAME,'Welcome to ChatApp'))
            
    //         //Broadcast when a user connects
    //         //Everyone except the user (i think)
    //         socket.broadcast.to(user.room).emit('message', formatMessage(BOTNAME, `${user.username} has joined the chat`))
            
    //         // Send Users and room Info 
    //         const roomUsers = await RoomUser.find({room: user.room})
    //         io.to(user.room).emit('roomUsers', {
    //             room: user.room,
    //             users: roomUsers
    //         })
    //     })
        
    //     //LIsten for chat message
    //     socket.on('chatMessage', async message => {
    //         // console.log(socket.id)
    //         // console.log(message)
    //         const user = await RoomUser.findOne({socketId: socket.id})
    //         // console.log(user)
    //         const chat = new Chat({
    //             username: user.username,
    //             room: user.room,
    //             message: message
    //         })
    //         await chat.save()

    //         io.to(user.room).emit('message',formatMessage(user.username, message))
    //     })
        
    //     socket.on('disconnect', async () => {
    //         if (!user){
    //             console.log('no user')
    //         }
            
    //         console.log('deletedUser', user.username) 
    //         const deletedUser = await RoomUser.findOne({username: user.username})
    //         // console.log(deletedUser)
    //         // Send Users and room Info 
    //         console.log(socket.id)
    //         const result = await RoomUser.deleteOne({socketId: socket.id})
    //         const roomUsers = await RoomUser.find({room: deletedUser.room})
    //         socket.broadcast.to(deletedUser.room).emit('roomUsers', {
    //             room: RoomUser.room,
    //             user: roomUsers
    //         })
    //         console.log(result)
    //         if(deletedUser){
    //             // was io before
    //             socket.broadcast.to(deletedUser.room).emit('message', formatMessage(BOTNAME, `${deletedUser.username} has left the Chat`))
    //         }

            
    //     })

    // })
    res.render('chat', {username: req.user.username})

}

exports.getDirectChat = async(req,res,next) => {
    const {recieverId} = req.params
    const recieverData = await User.findById(recieverId)
    
    const sender = req.user.username
    const reciever = recieverData.username

    // const room = [sender, reciever]
    // if(room[0] === sender || room[0] === reciever && room[1] === sender || room[1] === reciever){
    //     const roo
    // }
    // const room = req.user.username + '+' + reciever.username
    // console.log(room)
    // console.log(req.user.username)
    // console.log(reciever)
    // res.render('directchat', {reciever: recieverData.username, sender: req.user.username})
    res.render('directchat', {reciever: recieverData.username, recieverId: recieverId, senderId: req.user._id})
    // console.log(reciever)

}