const redisClient = require('../RedisClient')
const { setUserName, getUserId } = require('./userUtils')

const gameExists = async (code) => {
  return redisClient.exists(`games:${code}`)
}

async function joinGame (io, socket, code, userName) {
  const isGame = await gameExists(code)
  if (!isGame) {
    socket.emit('alert', 'error', 'Game does not exist!')
    return
  }
  await setUserName(socket, userName)
  // join 'game' room
  socket.join(code)
  // emit back to client
  socket.emit('joined game', code)
  // emit to all players in game room
  const userId = await getUserId(socket)
  socket.to(code).emit('player joined', { userId, userName })
}

module.exports = joinGame
