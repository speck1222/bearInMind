const redisClient = require('../RedisClient')
const { setUserName, getUserId, refreshUserSession, fetchMe } = require('./userUtils')

const gameExists = async (code) => {
  const gameExists = await redisClient.exists(`games:${code}:started`)
  return gameExists
}

async function getPlayers (code) {
  const playerIds = await redisClient.lrange(`games:${code}:players`, 0, -1)
  const hostId = await redisClient.get(`games:${code}:host`)
  const players = await Promise.all(playerIds.map(async (Id) => {
    const userName = await redisClient.get(`users:${Id}:userName`)
    return { userId: Id, userName, isHost: Id === hostId }
  }))
  return players
}

async function isPlayerInGame (code, playerId) {
  const playerIds = await redisClient.sMembers(`games:${code}:players`)
  if (playerId in playerIds) {
    return true
  }
  return false
}

async function joinGame (io, socket, code, userName) {
  const isGame = await gameExists(code)
  if (!isGame) {
    socket.emit('alert', 'error', 'Game does not exist!')
    return
  }
  // join 'game' room\
  const userId = await getUserId(socket)
  if (!userId) {
    socket.emit('alert', 'error', 'User does not exist! Try refreshing the browser.')
  }
  await setUserName(socket, userName)
  await redisClient.rpush(`games:${code}:players`, userId)
  await redisClient.set(`users:${userId}:currentGame`, code)
  socket.join(code)
  // re fetch user info
  fetchMe(socket)
  // emit to all players in game room
  const players = await getPlayers(code)
  socket.to(code).emit('fetched players', players)
}

async function fetchPlayers (io, socket, code) {
  console.log('Fetching players')
  const players = await getPlayers(code)
  socket.emit('fetched players', players)
}

async function leaveGame (io, socket, code) {
  const userId = await getUserId(socket)
  await redisClient.lrem(`games:${code}:players`, 0, userId)
  await redisClient.del(`users:${userId}:currentGame`)
  await redisClient.del(`users:${userId}:userName`)
  socket.leave(code)
  fetchMe(socket)
  let players = await getPlayers(code)
  if (players.length === 0) {
    await redisClient.del(`games:${code}:started`)
    await redisClient.del(`games:${code}:host`)
    await redisClient.del(`games:${code}:players`)
    await redisClient.del(`games:${code}:messages`)
    return
  }
  if (players.length === 1) {
    await redisClient.set(`games:${code}:host`, players[0].userId)
    players = await getPlayers(code)
  }
  socket.to(code).emit('fetched players', players)
}

module.exports.joinGame = joinGame
module.exports.fetchPlayers = fetchPlayers
module.exports.isPlayerInGame = isPlayerInGame
module.exports.leaveGame = leaveGame
