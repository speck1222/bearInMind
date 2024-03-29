import { React, createContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const localDev = false

const socketOrigin = localDev ? 'http://localhost:3001' : 'http://68.71.71.40:3001'
const socket = io(socketOrigin)

export const SocketContext = createContext(socket)

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
