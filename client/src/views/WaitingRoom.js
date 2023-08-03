import { Paper } from '@mui/material'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSocket } from '../websocket/useSocket'

export default function WaitingRoom () {
  const { gameId } = useParams()
  const socket = useSocket()
  const [players, setPlayers] = useState([])

  React.useEffect(() => {
    socket.emit('fetch players', gameId)
    socket.on('fetched players', (players) => {
      setPlayers(players)
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
        {players.map((player, iterator) => (
          <h3 key={iterator}>{player.userName}</h3>
        ))}
    </Paper>
  )
}
