const redisClient = require('./RedisClient')
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const { v4 } = require('uuid')
const initGame = require('./socketUtils/hostGame')
const { joinGame, fetchPlayers } = require('./socketUtils/JoinGame')

const PORT = process.env.PORT || 3001
const origin = process.env.NODE_ENV === 'production' ? 'https://bear-in-mind-frontend.game.peckappbearmind.com' : 'http://localhost:3000'

const runApplication = async () => {
  // Connect to redis at 127.0.0.1 port 6379 no password.
  const app = express()
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin
    }
  })

  app.get('/api', (req, res) => {
    res.json({ message: 'Hello from server!' })
  })
  // const server = new WebSocket.Server({ port : PORT })

  io.use(async (socket, next) => {
    // get session from client
    const sessionID = socket.handshake.auth.sessionID
    console.log('auth', socket.handshake.auth)
    console.log('from the client', sessionID)
    if (sessionID) {
    // find existing session
      const userId = await redisClient.hGet(`users:${sessionID}`, 'userId')
      // const userId = await redisClient.json.get(`users:${sessionID}`, '.userId')
      // if found set
      if (userId) {
        console.log('from redis', sessionID)
        return next()
      }
    }
    // create new session
    socket.sessionID = v4()
    socket.userId = v4()
    console.log('create new session', socket.sessionID)
    await redisClient.hSet(`users:${socket.sessionID}`, 'userId', socket.userId)
    // await redisClient.json.set(`users:${socket.sessionID}`, '.', { userId: socket.userId })
    socket.emit('session', {
      sessionID: socket.sessionID
    })

    return next()
  })

  io.on('connection', (socket) => {
    socket.join(socket.userID)

    socket.on('join', async (code, userName) => await joinGame(io, socket, code, userName))
    socket.on('init game', async () => await initGame(io, socket))
    socket.on('fetch players', async (code) => await fetchPlayers(io, socket, code))
  })

  httpServer.listen(PORT)
}

runApplication()
