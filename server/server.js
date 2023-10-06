
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const { initGame, startGame, fetchGameState, playCard, isReadyOutOfSync, deleteGame } = require('./socketUtils/gameUtils')
const { refreshUserSession, fetchMe } = require('./socketUtils/userUtils')
const { fetchPlayers, joinGame, leaveGame, getCurrentGame } = require('./socketUtils/joinUtils')
const { fetchMessages, sendMessage } = require('./socketUtils/chatUtils')

const PORT = 3001
const origin = 'http://localhost:3000'

const runApplication = async () => {
  // Connect to redis at 127.0.0.1 port 6379 no password.
  const app = express()
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  })

  app.get('/api', (req, res) => {
    res.json({ message: 'Hello from server!' })
  })
  // const server = new WebSocket.Server({ port : PORT })

  io.use(async (socket, next) => {
    await refreshUserSession(socket)
    return next()
  })

  io.on('connection', (socket) => {
    socket.join(socket.userID)

    // Wrap each async operation with a try-catch block
    const safeEmit = async (eventFunc, ...args) => {
      try {
        await eventFunc(...args)
      } catch (err) {
        console.error(`Error occurred in event: ${err.stack}`)
        const currentGame = await getCurrentGame(io, socket)
        if (currentGame) {
          io.sockets.in(currentGame).emit('alert', 'error', 'A fatal error occured! Terminating game... Please refresh your browser.')
          socket.leave(currentGame)
          deleteGame(currentGame)
        } else {
          socket.emit('alert', 'error', 'A fatal error occured! Please refresh your browser.')
        }
      }
    }

    socket.on('join', (code, userName) => safeEmit(joinGame, io, socket, code, userName))
    socket.on('leave game', (code) => safeEmit(leaveGame, io, socket, code))
    socket.on('init game', (userName) => safeEmit(initGame, io, socket, userName))
    socket.on('fetch players', (code) => safeEmit(fetchPlayers, io, socket, code))
    socket.on('fetch me', () => safeEmit(fetchMe, socket))
    socket.on('fetch messages', (code) => safeEmit(fetchMessages, io, socket, code))
    socket.on('send message', (code, message) => safeEmit(sendMessage, io, socket, code, message))
    socket.on('start game', (code) => safeEmit(startGame, io, socket, code))
    socket.on('fetch game state', (code) => safeEmit(fetchGameState, io, socket, code))
    socket.on('play card', (code, card) => safeEmit(playCard, io, socket, code, card))
    socket.on('is ready out of sync', (code) => safeEmit(isReadyOutOfSync, io, socket, code))
  })

  httpServer.listen(PORT)
}

runApplication()
