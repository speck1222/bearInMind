import { Paper, Card } from '@mui/material'
import { useSocket } from '../../websocket/useSocket'
import React, { useRef, useState, useEffect } from 'react'
import Hand from './Card'
import { useParams } from 'react-router-dom'
import MyButton from '../../components/Button'
import zIndex from '@mui/material/styles/zIndex'
import { motion } from 'framer-motion'

export default function GamePage ({ gameId, me }) {
  const constraintsRef = useRef(null)
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
    <div

      style={{
        marginTop: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column'
      }}>
      <motion.div ref={constraintsRef} style={{ overflow: 'hidden', border: '3px solid black', height: '630px', width: '400px' }}>

        <Hand cards={gameState.myHand} constraintsRef={constraintsRef} />
      </motion.div>
    </div>
  )
}
