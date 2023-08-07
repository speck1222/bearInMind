const redisClient = require('../RedisClient')
const { joinGame } = require('./joinUtils')
const { getUserId } = require('./userUtils')
const { sendServerMessage } = require('./chatUtils')

function generateGameCode () {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }

  return result
}

async function initGame (io, socket, userName) {
  const code = generateGameCode()
  const userId = await getUserId(socket)
  if (!userId) {
    socket.emit('alert', 'error', 'User does not exist! Try refreshing the browser.')
    return
  }
  await redisClient.set(`games:${code}:host`, userId)
  await redisClient.set(`games:${code}:started`, 0)
  await joinGame(io, socket, code, userName)
}

async function countDown (io, socket, code) {
  const countDown = 3
  sendServerMessage(io, code, 'Starting in...')
  await new Promise(resolve => setTimeout(resolve, 1000))
  for (let i = countDown; i > 0; i--) {
    sendServerMessage(io, code, `${i}...`)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

async function startGame (io, socket, code) {
  console.log('Starting game')
  await redisClient.set(`games:${code}:started`, 1)
  await countDown(io, socket, code)
  io.sockets.in(code).emit('start game')
  io.to(code).emit('game started', code)
}

module.exports.initGame = initGame
module.exports.startGame = startGame
