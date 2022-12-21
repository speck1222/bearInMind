import { Paper } from '@mui/material'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useSocket } from '../websocket/useSocket'

export default function WaitingRoom () {
  const { gameId } = useParams()
  const socket = useSocket()

  React.useEffect(() => {
    socket.emit('fetch players')
    socket.on('fetched players', (players) => {
      console.log(players)
    })
    socket.on('player joined', (player) => {
      console.log(player)
    })
    return () => {
      socket.off('fetched players')
      socket.off('player joined')
    }
  }, [])

  return (
    <Paper>
        <h1>Waiting Room</h1>
        <h3>{gameId}</h3>
    </Paper>
  )
}
