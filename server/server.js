const redisClient = require('./RedisClient')
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const { initGame, startGame } = require('./socketUtils/hostGame')
const { refreshUserSession, fetchMe } = require('./socketUtils/userUtils')
const { fetchPlayers, joinGame, leaveGame } = require('./socketUtils/joinUtils')
const { fetchMessages, sendMessage } = require('./socketUtils/chatUtils')

const PORT = process.env.PORT || 3001
const origin = process.env.NODE_ENV === 'production' ? 'https://bear-in-mind-frontend.game.peckappbearmind.com' : 'http://localhost:3000'
console.log(origin)

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
    refreshUserSession(socket)
    return next()
  })

  io.on('connection', (socket) => {
    socket.join(socket.userID)
    socket.on('join', async (code, userName) => await joinGame(io, socket, code, userName))
    socket.on('leave game', async (code) => await leaveGame(io, socket, code))
    socket.on('init game', async (userName) => await initGame(io, socket, userName))

    socket.on('fetch players', async (code) => await fetchPlayers(io, socket, code))
    socket.on('fetch me', async () => await fetchMe(socket))

    socket.on('fetch messages', async (code) => await fetchMessages(io, socket, code))
    socket.on('send message', async (code, message) => await sendMessage(io, socket, code, message))
    socket.on('start game', async (code) => await startGame(io, socket, code))
  })

  httpServer.listen(PORT)
}

runApplication()
