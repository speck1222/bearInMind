const redisClient = require('../RedisClient')

async function getUserId (socket) {
  const sessionID = socket.handshake.auth.sessionID
  const userId = await redisClient.hGet(`users:${sessionID}`, 'userId')
  return userId
}

async function setUserName (socket, userName) {
  const sessionID = socket.handshake.auth.sessionID
  await redisClient.hSet(`users:${sessionID}`, 'userName', userName)
}

async function fetchPlayers (io, socket, code) {
  console.log('fetching players')
}

module.exports.getUserId = getUserId
module.exports.setUserName = setUserName
module.exports.fetchPlayers = fetchPlayers
