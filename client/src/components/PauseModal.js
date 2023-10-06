
import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import MyButton from './Button'
import { motion, AnimatePresence } from 'framer-motion'
import ReadyButton from './ReadyButton'

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

function PauseModal ({ open, handleReady, pauseCountdown, children }) {
  if (!open) return null
  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div>
            {children}
          </div>
          <div style={{ flexShrink: 0 }}>
            <ReadyButton handleReady={handleReady} countDown={pauseCountdown} />
          </div>
        </div>
      </Box>
    </Modal>
  )
}

export default PauseModal
