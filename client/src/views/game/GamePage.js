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
  const socket = useSocket()
  const [gameState, setGameState] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [cards, setCards] = useState([])
  const [cardPlayed, setCardPlayed] = useState(null)

  function playCard (card) {
    socket.emit('play card', gameId, card)
    setCardPlayed(card)
    setCards(cards.filter(c => c !== card))
  }
  useEffect(() => {
    socket.emit('fetch game state', gameId)
    socket.on('fetched game state', (gameState) => {
      setGameState(gameState)
      setCards(gameState.myHand)
    })
  }, [])
  if (!gameState) return (<div>Loading...</div>)

  function removeFirstCard () {
    setIsPlaying(true)
  }

  const cardHolderStyle = {
    border: '3px dotted black',
    borderRadius: '5px',
    backgroundColor: 'white',
    width: '100px',
    height: '147px',
    margin: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0
  }

  const cardStyle = {
    border: '2px solid black',
    backgroundColor: 'white',
    borderRadius: '5px',
    width: '100px',
    height: '147px',
    boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column'
      }}>
      <motion.div ref={constraintsRef} style={{ overflow: 'hidden', border: '3px solid black', height: '630px', width: '360px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <div style={cardHolderStyle}>
            {cardPlayed && <div style={cardStyle}> <h1>{cardPlayed}</h1></div>}

          </div>
        </div>
        <Hand cards={cards} constraintsRef={constraintsRef} playCard={playCard} />
      </motion.div>
    </div>
  )
}
