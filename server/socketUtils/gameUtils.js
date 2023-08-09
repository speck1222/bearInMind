const redisClient = require('../RedisClient')
const { joinGame, getPlayers } = require('./joinUtils')
const { getUserId } = require('./userUtils')
const { sendServerMessage } = require('./chatUtils')

function generateGameCode () {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }

  return result
}

async function isHost (code, userId) {
  const hostId = await redisClient.get(`games:${code}:host`)
  return hostId === userId
}

async function initGame (io, socket, userName) {
  const code = generateGameCode()
  const userId = await getUserId(socket)
  if (!userId) {
    socket.emit('alert', 'error', 'User does not exist! Try refreshing the browser.')
    return
  }
  await redisClient.set(`games:${code}:host`, userId)
  await redisClient.set(`games:${code}:started`, 0)
  await joinGame(io, socket, code, userName)
}

async function countDown (io, socket, code) {
  const countDown = 3
  sendServerMessage(io, code, 'Starting in...')
  await new Promise(resolve => setTimeout(resolve, 1000))
  for (let i = countDown; i > 0; i--) {
    sendServerMessage(io, code, `${i}...`)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

async function startGame (io, socket, code) {
  const userId = await getUserId(socket)
  if (!await isHost(code, userId)) {
    socket.emit('alert', 'error', 'You are not the host!')
    return
  }
  await redisClient.set(`games:${code}:started`, 1)
  await countDown(io, socket, code)
  await dealCards(code, 10)
  io.sockets.in(code).emit('start game')
}

function shuffleDeck (deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

async function dealCards (code, numCards) {
  const players = await getPlayers(code)
  const deck = Array.from({ length: 100 }, (_, i) => i + 1)
  const shuffledDeck = shuffleDeck(deck)
  for (const player of players) {
    const hand = shuffledDeck.splice(0, numCards)
    const sortedHand = hand.sort((a, b) => a - b)
    await redisClient.rpush(`games:${code}:hands:${player.userId}`, sortedHand)
  }
}

async function fetchGameState (io, socket, code) {
  const userId = await getUserId(socket)
  if (!code) {
    socket.emit('alert', 'error', 'Game does not exist!')
    return
  }
  const players = await getPlayers(code)
  let myHand = []
  const cardCounts = await Promise.all(players.map(async (player) => {
    const hand = await redisClient.lrange(`games:${code}:hands:${player.userId}`, 0, -1)
    if (player.userId === userId) {
      myHand = hand
    }
    return { userId: player.userId, userName: player.userName, numCards: hand.length }
  }))
  socket.emit('fetched game state', { myHand, players, cardCounts })
}

async function playCard (io, socket, code, card) {
  const userId = await getUserId(socket)
  const hand = await redisClient.lrange(`games:${code}:hands:${userId}`, 0, -1)
  const cardIndex = hand.indexOf(card)
  if (cardIndex === -1) {
    socket.emit('alert', 'error', 'You do not have that card!')
    return
  }
  await redisClient.lrem(`games:${code}:hands:${userId}`, 0, card)
  io.sockets.in(code).emit('played card', { userId, card })
}

module.exports.initGame = initGame
module.exports.startGame = startGame
module.exports.isHost = isHost
module.exports.dealCards = dealCards
module.exports.fetchGameState = fetchGameState
module.exports.playCard = playCard
