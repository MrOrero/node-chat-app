const moment = require('moment')

function formatMessage(username, text){
    return{
        username,
        text,
        // time: moment().format('MMMM Do YYYY, h:mm a')
        time: moment().format('h:mm a')

    }
}

function formatAllchats(allChats){
    // allChats.map(chat => chat.createdAt = moment(chat.createdAt).format('dddd, MMMM Do YYYY, h:mm a'))
    const formattedChats = allChats.map(chat => {
        // chat.createdAt =  moment(chat.createdAt).format('dddd, MMMM Do YYYY, h:mm a')
        return{
            ...chat._doc, createdAt :  moment(chat.createdAt).format('h:mm a')
        }
    })
    return formattedChats

}

module.exports = {formatMessage, formatAllchats}