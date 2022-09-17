const express = require('express')
// const {check, body} = require('express-validator') //body,param,query,cookie,header

const chatController = require('../controllers/chat')

const router = express.Router()

router.get('/', chatController.getIndex);

router.get('/joinroom', chatController.getJoinRoom)

router.get('/chat', chatController.getChat)

router.get('/chat/:recieverId', chatController.getDirectChat)

module.exports = router