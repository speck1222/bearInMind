import { useSocket } from '../../websocket/useSocket'
import React, { useRef, useState, useEffect } from 'react'
import Hand from './Card'
import OutOfSyncModal from '../../components/OutOfSyncModal'
import { motion, useAnimation } from 'framer-motion'

export default function GamePage ({ gameId, me }) {
  const constraintsRef = useRef(null)
  const dropZoneRef = useRef(null)
  const cardHolderRef = useRef(null)
  const startingCardRef = useRef(null)
  const socket = useSocket()
  const [outOfSync, setOutOfSync] = useState(false)
  const [outOfSyncDetails, setOutOfSyncDetails] = useState({})
  const [pauseCountdown, setPauseCountdown] = useState(false)
  const [gameState, setGameState] = useState(null)
  const [cards, setCards] = useState([])
  const [cardPlayed, setCardPlayed] = useState(null)
  const [cardPlayedAnimation, setCardPlayedAnimation] = useState(null)
  const [dropZoneBounds, setDropZoneBounds] = useState({ left: 0, right: 0, top: 0, bottom: 0 })
  const [cardHolderPoints, setCardHolderPoints] = useState({ left: 0, right: 0, top: 0, bottom: 0 })
  const otherCardControls = useAnimation()

  useEffect(() => {
    const updateBounds = () => {
      if (dropZoneRef.current) {
        const bounds = dropZoneRef.current.getBoundingClientRect()
        setDropZoneBounds(bounds)
      }
      if (cardHolderRef.current && startingCardRef.current) {
        const holderBounds = cardHolderRef.current.getBoundingClientRect()
        const holderX = (holderBounds.left + holderBounds.right) / 2
        const holderY = (holderBounds.top + holderBounds.bottom) / 2

        const startingBounds = startingCardRef.current.getBoundingClientRect()
        const startingX = (startingBounds.left + startingBounds.right) / 2
        const startingY = (startingBounds.top + startingBounds.bottom) / 2

        setCardHolderPoints({ x: -startingX + holderX, y: -startingY + holderY })
      }
    }

    // Call the function initially
    updateBounds()

    // Set up the event listener
    window.addEventListener('resize', updateBounds)

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', updateBounds)
    }
  }, [gameState])

  async function otherCardPlayed (card) {
    console.log('other card played', card)
    setCardPlayedAnimation(card)
    // otherCardControls.start({ ...otherCardToHolderPoints })
    otherCardControls.start({ x: 0, y: -112, transition: { duration: 0.2, scale: 1.2 } })
    await new Promise(resolve => setTimeout(resolve, 200))
    setCardPlayed(card)
    otherCardControls.start({ x: 0, y: -600, transition: { duration: 0 } })
    setCardPlayedAnimation(null)
  }

  function handleGameState (gameState) {
    setGameState(gameState)
    setCards(gameState.myHand)
    setCardPlayed(gameState.currentCard)
    setOutOfSync(gameState.outOfSync === '1')
    setOutOfSyncDetails(gameState.outOfSyncDetails)
  }

  async function playCard (card) {
    socket.emit('play card', gameId, card)
    await new Promise(resolve => setTimeout(resolve, 190))
    setCardPlayed(card)
    setCards(cards.filter(c => c !== card))
  }
  function handleReadyOutOfSync () {
    socket.emit('is ready out of sync', gameId)
  }

  useEffect(() => {
    socket.emit('fetch game state', gameId)
    socket.on('fetched game state', (gameState) => {
      handleGameState(gameState)
    })
    socket.on('played card', (data) => {
      console.log('card played', data)
      otherCardPlayed(data.card)
    })
    socket.on('out of sync', (data) => {
      console.log('out of sync', data)
      setOutOfSync(data.outOfSync)
      setOutOfSyncDetails(data.details)
    })
    socket.on('out of sync resolved', () => {
      setOutOfSync(false)
      setOutOfSyncDetails({})
      setPauseCountdown(false)
      socket.emit('fetch game state', gameId)
    })
    socket.on('pause countdown', (count) => {
      setPauseCountdown(count)
    })
  }, [])
  if (!gameState) return (<div>Loading...</div>)

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
        flexDirection: 'column',
        height: '100vh'
      }}>
      <OutOfSyncModal handleReady={handleReadyOutOfSync} open={outOfSync} outOfSyncDetails={outOfSyncDetails} pauseCountdown={pauseCountdown} />
      <motion.div animate={otherCardControls} style={{ ...cardStyle, position: 'absolute', y: '-600px' }}> <h1>{cardPlayedAnimation}</h1></motion.div>
      <motion.div ref={constraintsRef} style={{ overflow: 'hidden', border: '3px solid black', height: '630px', width: '98%' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <div ref={dropZoneRef} style={{ paddingBottom: '90px', paddingTop: '80px', paddingLeft: '32%', paddingRight: '32%' }}>
            <div ref={cardHolderRef} style={cardHolderStyle}>
              {cardPlayed && <div style={cardStyle}> <h1>{cardPlayed}</h1></div>}
            </div>
          </div>
        </div>
        <Hand cards={cards} constraintsRef={constraintsRef} playCard={playCard} dropZoneBounds={dropZoneBounds} startingCardRef={startingCardRef} cardHolderPoints={cardHolderPoints} />
      </motion.div>
    </div>
  )
}
