const path = require('path')

const moment = require('moment')
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session)



const {formatMessage, formatAllchats} = require('./utils/format-message')
const RoomUser = require('./models/roomusers')
const Chat = require('./models/chat')
const User = require('./models/user')
const DirectChat = require('./models/directchat')
const chatRoutes = require('./routes/chat')
const authRoutes = require('./routes/auth')

const BOTNAME = 'Gist Bot'
const MongoDbURI = 'mongodb+srv://Orero:orero2002@cluster0.zf1ulpl.mongodb.net/chatApp?retryWrites=true&w=majority'
const PORT = 8080 || process.env.PORT

const app = express()

const sessionStore = new MongoDbStore({
    uri : MongoDbURI,
    collection: 'sessions'
})

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.urlencoded({extended: false}))
app.use(session({secret: 'Secret used for signing the hash', resave: false, saveUninitialized: false, store: sessionStore}))

app.use(async(req, res, next) =>  {
    // next (new Error('Sync dummy'))
    if (!req.session.user) {
        return next()
    }
    try{
        const user = await User.findById(req.session.user._id)
            if (!user) {
                return next()
            }
            req.user = user
            next()
    }catch(err){
        next (new Error(err))
    }
})

app.use((req,res,next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn
    next()
})

app.use(authRoutes)
app.use(chatRoutes)

app.use(express.static(path.join(__dirname, 'public')))

mongoose.connect(MongoDbURI)
.then(()=> {
    const server = app.listen(PORT, () => console.log(`Server running on ${PORT}`))
    
    const io = require('./socket').init(server)
    
    
    io.on('connection', socket => {

        const users = []

        socket.on('joinDirectMessage', async ({senderName}) =>{
            users[senderName] = socket.id
            console.log(users)
            // console.log(room)
            // socket.join(room)
            // socket.emit('dm', {message: message})

        })

        // socket.emit('dm', {message: 'hi'})

        // socket.on('directMessage', async ({message, recieverId, senderId}) => {
            socket.on('directMessage', async ({message, recieverId, senderId}) => {
            console.log(message)
            // const directChat = new DirectChat({
            //     reciever: recieverId,
            //     sender: senderId,
            //     message: message
            // })
            // await directChat.save()

            const sender = await User.findById(senderId)

            // console.log('sender is', sender)
            // io.to(socket.id).emit('dm',formatMessage(sender.username, message))
            io.to(socket.id).emit('dm',formatMessage('sender.username', message))

            // console.log(message,room)
            // const socketId = users[]
            // io.to(room).emit('dm', {message: message})
        })

    // io.emit - to all the clients in general
        // let chatUsers = []
        let user
        socket.on('joinRoom', async ({username, room})=> {
            // chatUsers[username] = socket.id
            console.log(username)
            const existingUser = await RoomUser.findOne({username: username})
            // // console.log(existingUser)\
            if(!existingUser){
            //     console.log('User already exists')
                const authUser = await User.findOne({username: username})
                user = new RoomUser({
                    username: username,
                    room: room,
                    socketId: socket.id,
                    userId: authUser
                })
                await user.save()
            }

            user = await RoomUser.findOne({username: username})

            //User Join Room
            socket.join(user.room)

            const allChats = await Chat.find({room: user.room}).limit(100).sort({ createdAt: 'asc'}).exec()
            const formattedChats = formatAllchats(allChats)
            socket.emit('allChats', formattedChats)

            //Welcome current user
            socket.emit('botMessage', formatMessage(BOTNAME,'Welcome to ChatApp'))
            
            //Broadcast when a user connects
            //Everyone except the user (i think)
            socket.broadcast.to(user.room).emit('botMessage', formatMessage(BOTNAME, `${user.username} has joined the chat`))
            
            // Send Users and room Info 
            const roomUsers = await RoomUser.find({room: user.room})
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: roomUsers
            })
        })
        
        //LIsten for chat message
        socket.on('chatMessage', async ({message, currentUser}) => {
            // console.log(socket.id)
            // console.log(message)
            const user = await RoomUser.findOne({username: currentUser})
            // console.log(user)
            const chat = new Chat({
                username: user.username,
                room: user.room,
                message: message
            })
            await chat.save()

            io.to(socket.id).emit('senderMessage',formatMessage(user.username, message))
            socket.broadcast.to(user.room).emit('recieversMessage', formatMessage(user.username, message))
        })
        
        socket.on('disconnect', async () => {
            if (!user){
                return console.log('no user')
            }
            // console.log(user.username) 
            const deletedUser = await RoomUser.findOne({username: user.username})
            await RoomUser.deleteOne({username: deletedUser.username})
            console.log(deletedUser)
            const roomUsers = await RoomUser.find({room: deletedUser.room})
            socket.broadcast.to(deletedUser.room).emit('roomUsers', {
                room: RoomUser.room,
                user: roomUsers
            })
            if(deletedUser){
                // was io before
                socket.broadcast.to(deletedUser.room).emit('botMessage', formatMessage(BOTNAME, `${deletedUser.username} has left the Chat`))
            }

            
        })
        
    })
})
.catch(err => console.log(err))