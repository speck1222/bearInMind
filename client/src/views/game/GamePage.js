import { Paper, Card } from '@mui/material'
import { useSocket } from '../../websocket/useSocket'
import React, { useRef, useState, useEffect } from 'react'
import Hand from './Card'
import { useParams } from 'react-router-dom'
import MyButton from '../../components/Button'

export default function GamePage ({ gameId, me }) {
  console.log(gameId)
  const socket = useSocket()
  const [gameState, setGameState] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  useEffect(() => {
    socket.emit('fetch game state', gameId)
    socket.on('fetched game state', (gameState) => {
      setGameState(gameState)
    })
  }, [])
  if (!gameState) return (<div>Loading...</div>)

  function removeFirstCard () {
    setIsPlaying(true)
  }

  console.log(gameState)
  return (
    <div>
      <Hand cards={gameState.myHand} />
    </div>
  )
}
