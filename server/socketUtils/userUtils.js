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
  await redisClient.set(`users:${userId}:userName`, userName)
}

const createNewSession = async (sessionId, userId) => {
  await redisClient.set(`session:${sessionId}:userId`, userId)
  await redisClient.set(`users:${userId}:sessionId`, sessionId)
}

const handleExistingSession = async (sessionId, socket) => {
  const userId = await redisClient.get(`session:${sessionId}:userId`)
  if (userId) {
    console.log('existing userId', userId)
    const currentGame = await redisClient.get(`users:${userId}:currentGame`)
    if (currentGame) {
      const gameStarted = await redisClient.get(`games:${currentGame}:started`)
      if (gameStarted === '1') {
        console.log('join game')
      }
      socket.emit('joined game', currentGame)
    }
  } else {
    console.log('create new userId')
    const newUserId = v4()
    await createNewSession(sessionId, newUserId)
  }
}

const refreshUserSession = async (socket) => {
  try {
    const sessionId = socket.handshake.auth.sessionID
    if (sessionId) {
      await handleExistingSession(sessionId, socket)
    } else {
      const newSessionId = v4()
      const userId = v4()
      await createNewSession(newSessionId, userId)
      socket.emit('session', {
        sessionID: newSessionId
      })
    }
  } catch (error) {
    console.error('An error occurred while refreshing user session:', error)
    // You might want to handle this error in some way, perhaps by emitting a message to the client.
  }
}

module.exports.getUserId = getUserId
module.exports.setUserName = setUserName
module.exports.refreshUserSession = refreshUserSession
