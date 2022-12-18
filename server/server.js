const WebSocket = require('ws');
const redis = require('redis');
const getRedisClient = require('./RedisClient');
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");


const PORT = process.env.PORT || 3001;
const origin = process.env.NODE_ENV === 'production' ? 'https://bear-in-mind-frontend.game.peckappbearmind.com' : 'http://localhost:3000'

const runApplication = async () => {
    // Connect to redis at 127.0.0.1 port 6379 no password.
    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
          origin: "http://localhost:3000"
        }
      });
    // const server = new WebSocket.Server({ port : PORT })
    const redisClient = getRedisClient()
    await redisClient.connect()

    io.on("connection", (socket) => {
        io.emit('hello', 'world');
    });
      
    httpServer.listen(PORT);
    
    // server.on('connection', async (ws) => {
    //     console.log('hey')
    //     ws.send('poop')
    //     ws.id = wss.getUniqueID();

    //     ws.clients.forEach(function each(client) {
    //         console.log('Client.ID: ' + client.id);
    //     });
    //   // broadcast on web socket when receving a Redis PUB/SUB Event
    // //   redisClient.on('message', (channel, message) => {
    // //     console.log(message)
    // //     ws.send(message)
    // //   })

      
    // })
    // server.on('poop')
    // console.log("WebSocket server started at ws://locahost:"+ PORT)
}

runApplication();