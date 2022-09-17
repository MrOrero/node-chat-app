const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const currentUser = document.getElementById('username').value

// Get username and room for Url
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io()

// Join chatroom
socket.emit('joinRoom', {username, room})


//Get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room)
    outputUsers(users)
})

socket.on('allChats', chats => {
    outputAllchats(chats)
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

socket.on('botMessage', botMessage => {
    outputBotMessage(botMessage)
    chatMessages.scrollTop = chatMessages.scrollHeight

})

socket.on('senderMessage', senderMessage => {
    outputSenderMessage(senderMessage)
    chatMessages.scrollTop = chatMessages.scrollHeight

})

socket.on('recieversMessage', recieversMessage => {
    // console.log(recieversMessage)
    outputRecieversMessage(recieversMessage)
    chatMessages.scrollTop = chatMessages.scrollHeight

})

socket.on('message', message => {
    // console.log(message.text)
    outputMessage(message)

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight

})

// Submit message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.msg.value

    socket.emit('chatMessage',{message, currentUser})

    //Clear Input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

//Output all chats to DOM
function outputAllchats(chats){
    chats.forEach(chat => {
 
        if (chat.username === currentUser ) {
            // console.log(chat.username, currentUser)
            const div = document.createElement('div')
            div.classList.add('sendermessage')
            div.innerHTML = `<p class="meta"><span>${chat.createdAt}</span></p>
            <p class="text">
                ${chat.message}
            </p>`
            document.querySelector('.chat-messages').appendChild(div)
        }else{
            const div = document.createElement('div')
            div.classList.add('message')
            div.innerHTML = `<p class="meta">${chat.username} <span> ${chat.createdAt} </span></p>
            <p class="text">
                ${ chat.message}
            </p>`
            document.querySelector('.chat-messages').appendChild(div)

        }

        // div.innerHTML = `<p class="meta">${chats.map(chat => chat.username).join('')} <span> time </span></p>
        // <p class="text">
        //     ${chats.map(chat => chat.message).join('')}
        // </p>`
        // document.querySelector('.chat-messages').appendChild(div)
    
    })


}

//Output message to DOM
function outputSenderMessage(message){
    const div = document.createElement('div')
    div.classList.add('sendermessage')
    div.innerHTML = `<p class="meta"><span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}

function outputRecieversMessage(message){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span> ${message.time} </span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}

function outputBotMessage(botMessage){
    const div = document.createElement('div')
    div.classList.add('botmessage')
    div.innerHTML = `<p class="meta"><span>${botMessage.username}</span></p>
    <p class="text">
        ${botMessage.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}

function outputRoomName(room){
    roomName.innerText = room
}

function outputUsers(users){
    // console.log(users)
    userList.innerHTML = `
        ${users.map(user => `<a href="http://localhost:8080/chat/${user.userId}"><li>${user.username}</li></a>`).join('')}
    `
    
    // const li = document.createElement('li')
    // users.forEach(user => {
    //  li.innerText = user.username
    //  userList.appendChild(li)
    // })
}