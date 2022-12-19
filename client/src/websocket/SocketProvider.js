import { React, createContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socketOrigin = process.env.NODE_ENV === 'production' ? 'https://bear-in-mind-backend.game.peckappbearmind.com' : 'http://localhost:3001'
const socket = io(socketOrigin)

export const SocketContext = createContext(socket)

console.log('setting in auth', localStorage.getItem('sessionID'))
socket.auth = { sessionID: localStorage.getItem('sessionID') }

export const SocketProvider = (props) => {
  useEffect(() => {
    socket.on('session', ({ sessionID }) => {
      localStorage.setItem('sessionID', sessionID)
    })
    return () => {
      socket.off('session')
    }
  }, [])
  return (
    <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>
  )
}
