import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MyButton from '../../components/Button'
import zIndex from '@mui/material/styles/zIndex'
import { drawerClasses } from '@mui/material'

const containerStyle = {
  display: 'flex',
  width: '100%',
  padding: '10px 0',
  whiteSpace: 'nowrap',
  position: 'relative',
  marginTop: '40px'
}

const Hand = ({ cards, constraintsRef }) => {
  const [isPlaying, setIsPlaying] = useState(false)

  const cardStyle = {
    border: '2px solid black',
    backgroundColor: 'white',
    borderRadius: '5px',
    width: '100px',
    height: '140px',
    marginRight: '10px',
    boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0
  }

  const cardHolderStyle = {
    border: '2px solid black',
    backgroundColor: 'green',
    borderRadius: '5px',
    width: '140px',
    height: '180px',
    margin: '10px',
    boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    zIndex: 1
  }

  const firstCardStyle = {
    ...cardStyle,
    height: '147px'
  }

  return (
    <div style={{ marginTop: '400px' }} >
      <div style={containerStyle} >
        <div style={cardHolderStyle}>
          <motion.div style={{ ...firstCardStyle }} drag dragConstraints={constraintsRef}>
            <h1>{cards[0]}</h1>
          </motion.div>
        </div>
        <motion.div style={containerStyle} drag='x' dragConstraints={{ top: 0, right: 0, bottom: 0, left: -300 }}>
        {cards.slice(1).map((card, index) => (
            <div key={index} style={cardStyle}>
              <h1>{card}</h1>
            </div>
        ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Hand
