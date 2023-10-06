/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import MyButton from './Button'
import { motion, AnimatePresence } from 'framer-motion'

function ReadyButton ({ handleReady, countDown }) {
  const [isChecked, setChecked] = useState(false)

  function handleClick () {
    setChecked(!isChecked)
    handleReady()
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <AnimatePresence mode='wait'>
        {!isChecked ? (
          <motion.div
            key="button"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            {/* Your button SVG */}
            <MyButton onClick={handleClick} width='80px' gradient='primary' label='Ready?'/>
          </motion.div>
        ) : (
          <motion.div
            key="check"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.1 }}
          >
            {/* Your checkmark SVG */}
            <motion.svg height="100" width="100">
              {/* Springy green circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="green"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20
                }}
              />
              {/* Drawing white checkmark */}
              {typeof countDown === 'number' ? (
                <motion.text
                  x="50"
                  y="68" // Adjust these values to properly center the text
                  fontSize="50"
                  fill="white"
                  textAnchor="middle"
                >
                  {countDown}
                </motion.text>
              ) : (
                <motion.path
                  d="M 10,50 L 45,80 L 90,20"
                  fill="transparent"
                  stroke="white"
                  strokeWidth="10"
                  initial={{ pathLength: 0, scale: 0.7 }}
                  animate={{ pathLength: 1, scale: 0.7 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                />
              )}
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
const messages = []

const tinyCardStyle = {
  border: '2px solid black',
  backgroundColor: 'white',
  borderRadius: '3px',
  width: '26px',
  height: '35px',
  boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.3)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexShrink: 0,
  margin: '0 5px'
}

const cardRowStyle = {
  display: 'flex',
  alignItems: 'center'
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  height: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

function getRandomMessage () {
  return messages[Math.floor(Math.random() * messages.length)]
}

function OutOfSyncModal ({ open, outOfSyncDetails, handleReady, pauseCountdown }) {
  const [message, setMessage] = useState('')
  console.log('outOfSyncDetails', outOfSyncDetails)
  useEffect(() => {
    setMessage(getRandomMessage())
  }, [message])
  if (!open) return null
  return (
    <Modal
  open={open}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 id="modal-modal-title">{outOfSyncDetails.message}</h2>
      <div style={{ flex: '1', overflowY: 'auto' }}>
        <div style={cardRowStyle}>
          <h3>{outOfSyncDetails.justPlayed.name} played:</h3>
          <div style={tinyCardStyle}>
            {outOfSyncDetails.justPlayed.card}
          </div>
        </div>
        {Object.entries(outOfSyncDetails.players).map(([name, details]) => {
          if (details.cardsToDiscard?.length > 0) {
            return (
              <div key={name}>
                <div style={cardRowStyle}>
                  <h3>{name} needs to discard:</h3>
                  {details.cardsToDiscard.map((card, index) => (
                    <div style={tinyCardStyle} key={index}>
                      {card}
                    </div>
                  ))}
                </div>
              </div>
            )
          }
          return null
        })}
      </div>
      <div style={{ flexShrink: 0 }}>
        <ReadyButton handleReady={handleReady} countDown={pauseCountdown} />
      </div>
    </div>
  </Box>
</Modal>
  )
}
export default OutOfSyncModal
