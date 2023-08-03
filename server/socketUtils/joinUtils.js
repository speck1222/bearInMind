const redisClient = require('../RedisClient')
const { setUserName, getUserId } = require('./userUtils')

const gameExists = async (code) => {
  const gameExists = await redisClient.exists(`games:${code}:started`)
  console.log('game exists', gameExists)
  return gameExists
}

async function getPlayers (code) {
  const playerIds = await redisClient.lrange(`games:${code}:players`, 0, -1)
  console.log('playerIds', playerIds)
  const players = await Promise.all(playerIds.map(async (Id) => {
    const userName = await redisClient.get(`users:${Id}:userName`)
    return { userId: Id, userName }
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
  console.log('Joining game')
  const isGame = await gameExists(code)
  if (!isGame) {
    socket.emit('alert', 'error', 'Game does not exist!')
    return
  }
  await setUserName(socket, userName)
  // join 'game' room
  const userId = await getUserId(socket)
  console.log('this is the code --> ', code)
  await redisClient.rpush(`games:${code}:players`, userId)
  await redisClient.set(`users:${userId}:currentGame`, code)
  socket.join(code)
  // emit back to client
  socket.emit('joined game', code)
  // emit to all players in game room
  const players = await getPlayers(code)
  socket.to(code).emit('fetched players', players)
}

async function fetchPlayers (io, socket, code) {
  console.log('Fetching players')
  const players = await getPlayers(code)
  socket.emit('fetched players', players)
}

module.exports.joinGame = joinGame
module.exports.fetchPlayers = fetchPlayers
module.exports.isPlayerInGame = isPlayerInGame
