const redisClient = require('../RedisClient')
const { setUserName, getUserId, fetchMe, getUserName } = require('./userUtils')
const { sendServerMessage } = require('./chatUtils')
const { deleteKeysWithPrefix } = require('../redisUtils/utils')

const colors = [
  '#795548', // Brown
  '#FF9800', // Orange
  '#009688', // Teal
  '#8BC34A', // Light Green
  '#9C27B0', // Purple
  '#F44336', // Red
  '#2196F3', // Blue
  '#FFEB3B' // Yellow
]

async function deleteGame (code) {
  redisClient.del(`games:${code}:players`)
  redisClient.del(`games:${code}:started`)
  redisClient.del(`games:${code}:host`)
  redisClient.del(`games:${code}:currentCard`)
  redisClient.del(`games:${code}:outOfSync`)
  redisClient.del(`games:${code}:outOfSyncDetails`)
  redisClient.del(`games:${code}:paused`)
  redisClient.del(`games:${code}:pausedDetails`)
}

const gameExists = async (code) => {
  const gameExists = await redisClient.exists(`games:${code}:started`)
  return gameExists
}

async function getCurrentGame (io, socket) {
  const userId = await getUserId(socket)
  if (!userId) {
    return null
  }
  const currentGame = await redisClient.get(`users:${userId}:currentGame`)
  return currentGame
}

async function getPlayers (code) {
  const playerIds = await redisClient.lrange(`games:${code}:players`, 0, -1)
  const hostId = await redisClient.get(`games:${code}:host`)
  const players = await Promise.all(playerIds.map(async (Id) => {
    const userName = await redisClient.get(`users:${Id}:userName`)
    const color = await redisClient.get(`users:${Id}:color`)
    return { userId: Id, userName, isHost: Id === hostId, color }
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

async function availableColors (code) {
  const players = await getPlayers(code)
  const takenColors = players.map(player => player.color)
  const availableColors = colors.filter(color => !takenColors.includes(color))
  return availableColors
}

async function randomAvailableColor (code) {
  const players = await getPlayers(code)
  const takenColors = players.map(player => player.color)
  const availableColors = colors.filter(color => !takenColors.includes(color))
  const randomIndex = Math.floor(Math.random() * availableColors.length)
  return availableColors[randomIndex]
}

async function changeColor (io, socket, code, color) {
  console.log('change color', code, color)
  color = color.toUpperCase()
  const colors = await availableColors(code)
  console.log(colors)
  if (!colors.includes(color)) {
    socket.emit('alert', 'error', 'Color is already taken!')
    return
  }
  const userId = await getUserId(socket)
  await redisClient.set(`users:${userId}:color`, color)
  const players = await getPlayers(code)
  socket.to(code).emit('fetched players', { players, availableColors: colors })
}

async function joinGame (io, socket, code, userName) {
  const isGame = await gameExists(code)
  if (!isGame) {
    socket.emit('alert', 'error', 'Game does not exist!')
    return
  }
  const gameStarted = await redisClient.get(`games:${code}:started`)
  if (gameStarted === '1') {
    socket.emit('alert', 'error', 'Game has already started!')
    return
  }
  // join 'game' room\
  const userId = await getUserId(socket)
  if (!userId) {
    socket.emit('alert', 'error', 'User does not exist! Try refreshing the browser.')
    return
  }
  await setUserName(socket, userName)
  await redisClient.rpush(`games:${code}:players`, userId)
  await redisClient.set(`users:${userId}:currentGame`, code)
  await redisClient.set(`users:${userId}:color`, await randomAvailableColor(code))
  socket.join(code)
  // re fetch user info
  fetchMe(socket)
  // emit to all players in game room
  const players = await getPlayers(code)
  socket.to(code).emit('fetched players', { players, availableColors: await availableColors(code) })
  sendServerMessage(io, code, `${userName} has joined the game.`)
}

async function fetchPlayers (io, socket, code) {
  const players = await getPlayers(code)
  socket.emit('fetched players', { players, availableColors: await availableColors(code) })
}

async function leaveGame (io, socket, code) {
  const userId = await getUserId(socket)
  const userName = await getUserName(userId)
  await redisClient.lrem(`games:${code}:players`, 0, userId)
  await redisClient.del(`users:${userId}:currentGame`)
  await redisClient.del(`users:${userId}:userName`)
  socket.leave(code)
  fetchMe(socket)
  let players = await getPlayers(code)
  if (players.length === 0) {
    deleteGame(code)
    return
  }
  if (players.length === 1) {
    await redisClient.set(`games:${code}:host`, players[0].userId)
    players = await getPlayers(code)
  }
  sendServerMessage(io, code, `${userName} has left the game.`)
  socket.to(code).emit('fetched players', { players, availableColors: await availableColors(code) })
}

module.exports.joinGame = joinGame
module.exports.fetchPlayers = fetchPlayers
module.exports.isPlayerInGame = isPlayerInGame
module.exports.leaveGame = leaveGame
module.exports.getPlayers = getPlayers
module.exports.getCurrentGame = getCurrentGame
module.exports.changeColor = changeColor
