const redisClient = require('../RedisClient')
const { getUserId } = require('./userUtils')
const { v4 } = require('uuid')

async function fetchMessages (io, socket, code) {
  const messages = await redisClient.lrange(`games:${code}:messages`, 0, -1)
  const parsedMessages = messages.map((message) => JSON.parse(message))
  socket.emit('fetched messages', parsedMessages)
}

async function sendMessage (io, socket, code, message) {
  console.log('Sending message', message)
  const userId = await getUserId(socket)
  const userName = await redisClient.get(`users:${userId}:userName`)
  const messageId = v4()
  const messageObject = {
    messageId,
    userId,
    userName,
    message
  }
  await redisClient.rpush(`games:${code}:messages`, JSON.stringify(messageObject))
  console.log('Emitting message to room', code)
  io.sockets.in(code).emit('new message', messageObject)
}

async function sendServerMessage (io, code, message) {
  const messageId = v4()
  const messageObject = {
    messageId,
    message,
    userName: 'System'
  }
  await redisClient.rpush(`games:${code}:messages`, JSON.stringify(messageObject))
  io.sockets.in(code).emit('new message', messageObject)
}

module.exports.fetchMessages = fetchMessages
module.exports.sendMessage = sendMessage
module.exports.sendServerMessage = sendServerMessage
