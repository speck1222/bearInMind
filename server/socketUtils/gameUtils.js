const redisClient = require('../RedisClient')
const { joinGame, getPlayers } = require('./joinUtils')
const { getUserId, getUserName } = require('./userUtils')
const { sendServerMessage } = require('./chatUtils')
const { json } = require('express')

const messages = [
  "Bear with us! Looks like you're on a 'paws' of a mistake! 🐻🐾",
  "Wood you believe it? You've gone astray! 🌲",
  "You've gone nuts! Squirrel those cards back! 🐿️",
  "You're berry mistaken! Let's re-'root'! 🍓🌳",
  "Un-bee-lievable! Time to 'bee-have'! 🐝",
  "Oh, deer! Looks like you've stumbled on a 'buck'! 🦌",
  "Fir real? Time for a 'tree-do'! 🌲",
  "Whoa there! We've got a 'claw-sal' error! 🐾",
  'Hive got a feeling we need a do-over! 🐝',
  "You otter know better! Let's fix this dam mistake! 🦦",
  "You've branched off the path, leaf it and let's regrow! 🌿",
  "Paws for thought! A 'claw-sal' calamity has occurred! 🐾",
  "Mistakes pine-sist! Let's 'spruce' up our game! 🌲",
  "Don't 'beet' yourself up! Let's 'turnip' for another round! 🌰",
  "A 'hare-raising' hiccup! Let's hop back on track! 🐰",
  "Looks like someone's fishing for trouble! Let's reel it back! 🐟",
  "Oh my bear! A 'grizzly' error has occurred! 🐻",
  "You've 'moss-takenly' gone the wrong way! Let's retrace our steps! 🌱",
  'Whoa, bear! Time to paws and reflect! 🐻🐾',
  "Something's fishy, time to scale back! 🐟",
  "Waddle we do? You've quacked the game! 🦆",
  "Time to 'paws' and rewind! 🐾",
  "That's a badger of dishonor! Let's dig our way out! 🦡",
  "We've hit a 'snag'! Let's lumber on back! 🌳",
  "Froget about it! Let's 'hop' to a new leaf! 🐸",
  "That's a 'bark' in the wrong tree! 🌳",
  "A little 'sappy', aren't we? Let's 'stick' to the game! 🍁",
  "A 'mole-hill' of a problem! Time to 'burrow' in and sort it out! 🌰",
  "Let's not raccoon-cile just yet, time to 'trash' that move! 🦝",
  "We've got a 'beaver-y' big problem, let's dam up and try again! 🦫",
  "Oh honey, you've 'bee-n' mistaken! 🍯🐝",
  "That's a sticky situation, but let's not bee too hard on ourselves! 🍯",
  "Bee positive! It's just a little buzz-take! 🐝",
  "Don't worry, 'bee' happy! We can comb over this! 🍯🐝",
  "We've hit a hive note! Time to 'wax' poetic and move on! 🍯",
  "Time to 'nectar-tify' that move! 🍯",
  "That was un'bee'lievable! Let's swarm back into place! 🐝",
  "Buzz off, mistake! We've got a hive to run! 🍯🐝",
  "You're the bee's knees, but that was a honey of a mistake! 🍯",
  'Pollinating in the wrong direction, are we? 🐝'
]

function getRandomMessage () {
  return messages[Math.floor(Math.random() * messages.length)]
}

function generateGameCode () {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }

  return result
}

async function deleteGame (code) {
  redisClient.del(`games:${code}:players`)
  redisClient.del(`games:${code}:started`)
  redisClient.del(`games:${code}:host`)
  redisClient.del(`games:${code}:currentCard`)
  redisClient.del(`games:${code}:outOfSync`)
  redisClient.del(`games:${code}:outOfSyncDetails`)
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
  await redisClient.set(`games:${code}:started`, '0')
  await redisClient.set(`games:${code}:host`, userId)
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
  const started = await redisClient.get(`games:${code}:started`)
  console.log('started', started)
  if (started === '1') {
    console.log('game already started')
    return
  }
  await redisClient.set(`games:${code}:started`, '1')
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
  const currentCard = await redisClient.get(`games:${code}:currentCard`)
  const outOfSync = await redisClient.get(`games:${code}:outOfSync`)
  const outOfSyncDetails = await redisClient.get(`games:${code}:outOfSyncDetails`)
  let parsedOutOfSyncDetails = {}
  if (outOfSyncDetails) {
    parsedOutOfSyncDetails = JSON.parse(outOfSyncDetails)
  }
  socket.emit('fetched game state', { myHand, players, cardCounts, currentCard, outOfSync, outOfSyncDetails: parsedOutOfSyncDetails })
}

async function playCard (io, socket, code, card) {
  const userId = await getUserId(socket)
  const hand = await redisClient.lrange(`games:${code}:hands:${userId}`, 0, -1)
  const cardIndex = hand.indexOf(card)
  if (cardIndex === -1) {
    socket.emit('alert', 'error', 'You do not have that card!')
    return
  }
  if (cardIndex !== 0) {
    socket.emit('alert', 'error', 'You can only play the lowest card in your hand!')
    return
  }
  await redisClient.lrem(`games:${code}:hands:${userId}`, 0, card)
  await redisClient.set(`games:${code}:currentCard`, card)
  const outOfSync = await checkForOutOfSync(code, card, userId)
  if (outOfSync.outOfSync) {
    await redisClient.set(`games:${code}:outOfSync`, '1')
    await redisClient.set(`games:${code}:outOfSyncDetails`, JSON.stringify(outOfSync.details))
    io.sockets.in(code).emit('out of sync', outOfSync)
  }
  socket.to(code).emit('played card', { userId, card })
}

async function getPlayerHands (code) {
  const players = await getPlayers(code) // Assuming getPlayers is your function to get all player info
  const playerHands = {}

  for (const player of players) {
    const hand = await redisClient.lrange(`games:${code}:hands:${player.userId}`, 0, -1)
    playerHands[player.userId] = hand.map(Number) // Assuming the cards are stored as strings
  }

  return playerHands
}

async function checkForOutOfSync (code, cardNumber, userJustPlayed) {
  const playerHands = await getPlayerHands(code)
  const outOfSync = {}
  for (const [userId, hand] of Object.entries(playerHands)) {
    const cardsToDiscard = hand.filter(card => card < cardNumber)

    if (cardsToDiscard.length > 0) {
      const playerName = await getUserName(userId)
      if (!outOfSync.players) {
        outOfSync.players = {}
      }
      if (!outOfSync.players[playerName]) {
        outOfSync.players[playerName] = {}
      }
      const userName = await getUserName(userJustPlayed)
      outOfSync.justPlayed = { name: userName, card: cardNumber }

      outOfSync.players[playerName].cardsToDiscard = cardsToDiscard
      outOfSync.message = getRandomMessage()
      const players = await getPlayers(code)
      for (const player of players) {
        if (!outOfSync.players[player.userName]) {
          outOfSync.players[player.userName] = {}
        }
        outOfSync.players[player.userName].isReady = false
      }
    }
  }

  return Object.keys(outOfSync).length > 0 ? { outOfSync: true, details: outOfSync } : { outOfSync: false }
}

async function isReadyOutOfSync (io, socket, code) {
  const userId = await getUserId(socket)
  const userName = await getUserName(userId)
  const outOfSyncDetails = await redisClient.get(`games:${code}:outOfSyncDetails`)
  const parsedOutOfSyncDetails = JSON.parse(outOfSyncDetails)
  if (!(userName in parsedOutOfSyncDetails.players)) {
    parsedOutOfSyncDetails.players[userName] = {}
  }
  parsedOutOfSyncDetails.players[userName].isReady = true
  const isEveryoneReady = Object.values(parsedOutOfSyncDetails.players).every(player => player.isReady)
  if (isEveryoneReady) {
    console.log('everyone is ready')
    await redisClient.set(`games:${code}:outOfSync`, '0')
    await redisClient.set(`games:${code}:outOfSyncDetails`, '')
    const countDown = 3
    for (let i = countDown; i > 0; i--) {
      io.sockets.in(code).emit('pause countdown', i)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    Object.values(parsedOutOfSyncDetails.players).forEach(player => {
      console.log(parsedOutOfSyncDetails.players)
      if (player.cardsToDiscard) {
        player.cardsToDiscard.forEach(card => {
          redisClient.lrem(`games:${code}:hands:${userId}`, 0, card)
        })
      }
    })
    io.sockets.in(code).emit('out of sync resolved')
  } else {
    await redisClient.set(`games:${code}:outOfSyncDetails`, JSON.stringify(parsedOutOfSyncDetails))
  }
}

module.exports.initGame = initGame
module.exports.startGame = startGame
module.exports.isHost = isHost
module.exports.dealCards = dealCards
module.exports.fetchGameState = fetchGameState
module.exports.playCard = playCard
module.exports.isReadyOutOfSync = isReadyOutOfSync
module.exports.deleteGame = deleteGame
