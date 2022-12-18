import { React, createContext } from 'react'
import { io } from 'socket.io-client'

const socketOrigin = process.env.NODE_ENV === 'production' ? 'https://bear-in-mind-backend.game.peckappbearmind.com' : 'http://localhost:3001'
const socket = io(socketOrigin)

export const SocketContext = createContext(socket)

export const SocketProvider = (props) => {
  return (
    <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>
  )
}
