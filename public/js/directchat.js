const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const recieverId = document.getElementById('recieverId').value
const senderId = document.getElementById('senderId').value
// const room = document.getElementById('room').value
const userList = document.getElementById('users')


// const room = recieverName + '+' + senderName
// console.log(recieverId, senderId)

const socket = io()

// socket.emit('joinDirectMessage', {senderName})

socket.on('dm', message => {
    // console.log(message.text)
    console.log(message)
    outputSenderMessage(message)

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight

})
// Submit message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.msg.value

    console.log(message)

    socket.emit('directMessage',{message, recieverId, senderId})

    //Clear Input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})


function outputSenderMessage(message){
    const div = document.createElement('div')
    div.classList.add('sendermessage')
    div.innerHTML = `<p class="meta"><span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}

function outputMessage(message){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}
