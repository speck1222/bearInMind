/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import MyButton from './Button'
import { motion, AnimatePresence } from 'framer-motion'
import ReadyButton from './ReadyButton'
import PauseModal from './PauseModal'

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
  margin: '0 4px'
}

const cardRowStyle = {
  display: 'flex',
  alignItems: 'center'
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
    <PauseModal open={open} pauseCountdown={pauseCountdown} handleReady={handleReady}>
      <div>
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
        </div>
    </PauseModal>
  )
}
export default OutOfSyncModal
