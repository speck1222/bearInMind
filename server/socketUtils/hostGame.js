const redisClient = require('../RedisClient')
const { getUserId } = require('./userUtils')

function generateGameCode () {
  return Math.random().toString(16).substr(2, 4)
}

async function initGame (io, socket) {
  const code = generateGameCode()
  const userId = await getUserId(socket)
  await redisClient.hSet(`games:${code}`, 'hostUser', userId)
  socket.join(code)
}

module.exports = initGame
