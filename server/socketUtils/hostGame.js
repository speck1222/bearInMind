const redisClient = require('../RedisClient')
const { joinGame } = require('./joinUtils')
const { getUserId } = require('./userUtils')

function generateGameCode () {
  return Math.random().toString(16).substr(2, 4)
}

async function initGame (io, socket, userName) {
  console.log('Creating game')
  const code = generateGameCode()
  const userId = await getUserId(socket)
  await redisClient.set(`games:${code}:host`, userId)
  await redisClient.set(`games:${code}:started`, 1)
  await joinGame(io, socket, code, userName)
  // socket.join(code)
  // socket.emit('joined game', code)
}

module.exports = initGame
