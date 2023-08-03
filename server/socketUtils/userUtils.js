const redisClient = require('../RedisClient')
const { v4 } = require('uuid')

async function getUserId (socket) {
  const sessionID = socket.handshake.auth.sessionID
  console.log('sessionID', sessionID)
  const userId = await redisClient.get(`session:${sessionID}:userId`)
  console.log('userId', userId)
  return userId
}

async function setUserName (socket, userName) {
  const userId = await getUserId(socket)
  console.log(userId)
  await redisClient.set(`users:${userId}:userName`, userName)
}

async function refreshUserSession (socket) {
  // get session from client
  const sessionID = socket.handshake.auth.sessionID
  if (sessionID) {
    // find existing session
    const userId = await redisClient.get(`session:${sessionID}:userId`)
    if (userId) {
      const currentGame = await redisClient.get(`users:${userId}:currentGame`)
      if (currentGame) {
        const gameStarted = await redisClient.get(`games:${currentGame}:started`)
        if (gameStarted === 1) {
          console.log('join game')
        }
        console.log('game already exists')
        socket.emit('joined game', currentGame)
      }
      return
    }
  }
  // create new session
  socket.sessionID = v4()
  socket.userId = v4()
  await redisClient.set(`session:${socket.sessionID}:userId`, socket.userId)
  await redisClient.set(`users:${socket.userId}:sessionId`, socket.sessionID)
  // await redisClient.json.set(`users:${socket.sessionID}`, '.', { userId: socket.userId })
  socket.emit('session', {
    sessionID: socket.sessionID
  })
}

module.exports.getUserId = getUserId
module.exports.setUserName = setUserName
module.exports.refreshUserSession = refreshUserSession
