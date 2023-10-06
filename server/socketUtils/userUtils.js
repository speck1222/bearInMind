const redisClient = require('../RedisClient')
const { v4 } = require('uuid')

async function getUserId (socket) {
  const sessionID = socket.handshake.auth.sessionID
  const userId = await redisClient.get(`session:${sessionID}:userId`)
  return userId
}

async function getUserName (userId) {
  userId = await redisClient.get(`users:${userId}:userName`)
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
    const currentGame = await redisClient.get(`users:${userId}:currentGame`)
    if (currentGame) {
      socket.join(currentGame)
      fetchMe(socket)
    }
  } else {
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

const fetchMe = async (socket) => {
  const sessionId = socket.handshake.auth.sessionID
  const userId = await redisClient.get(`session:${sessionId}:userId`)
  const userName = await redisClient.get(`users:${userId}:userName`)
  let currentGame = await redisClient.get(`users:${userId}:currentGame`)
  const gameStarted = await redisClient.get(`games:${currentGame}:started`)
  const isHost = await redisClient.get(`games:${currentGame}:host`) === userId
  const gameExists = await redisClient.exists(`games:${currentGame}:started`)
  if (!gameExists) {
    await redisClient.del(`users:${userId}:currentGame`)
    currentGame = null
  }
  socket.emit('fetched me', { userId, userName, currentGame, gameStarted, isHost })
}

module.exports.getUserId = getUserId
module.exports.setUserName = setUserName
module.exports.refreshUserSession = refreshUserSession
module.exports.fetchMe = fetchMe
module.exports.getUserName = getUserName
