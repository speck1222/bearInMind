const redisClient = require('../RedisClient')
const { joinGame } = require('./joinUtils')
const { getUserId } = require('./userUtils')

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
  console.log('Creating game')
  const code = generateGameCode()
  const userId = await getUserId(socket)
  if (!userId) {
    socket.emit('alert', 'error', 'User does not exist! Try refreshing the browser.')
    return
  }
  await redisClient.set(`games:${code}:host`, userId)
  await redisClient.set(`games:${code}:started`, 1)
  await joinGame(io, socket, code, userName)
}

module.exports = initGame
