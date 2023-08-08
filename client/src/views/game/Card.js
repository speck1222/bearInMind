import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import MyButton from '../../components/Button'

const containerStyle = {
  display: 'flex',
  overflowX: 'scroll',
  overflowY: 'hidden',
  width: '100%',
  marginTop: '460px',
  padding: '10px 0',
  whiteSpace: 'nowrap',
  WebkitOverflowScrolling: 'touch',
  /* Hide scrollbar for Chrome, Safari, and Opera */
  '&::WebkitScrollbar': {
    display: 'none'
  },

  /* Hide scrollbar for Firefox */
  scrollbarWidth: 'none',

  /* Hide scrollbar for IE and Edge */
  msOverflowStyle: 'none'
}

const Hand = ({ cards }) => {
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
    transition: 'translate 1s ease-in-out',
    flexShrink: 0,
    transform: 'translateY(7px)'
  }

  const firstCardStyle = {
    ...cardStyle,
    height: '147px',
    transition: 'transform .8s ease-in-out'
  }

  const playCardAnimation = {
    x: isPlaying ? window.innerWidth / 2 - 70 : 0, // Assuming card width is 100px
    y: isPlaying ? window.innerHeight / 2 - 800 : 0, // Assuming card height is 140px
    position: isPlaying ? 'fixed' : 'relative',
    zIndex: isPlaying ? 1 : 0
  }

  return (
    <div>
      <MyButton onClick={() => setIsPlaying(true)} label='Play' />
      <div style={containerStyle}>
      {cards.map((card, index) => (
        index === 0
          ? <motion.div key={index} style={{ ...firstCardStyle, ...playCardAnimation }} transition={{ duration: 0.9 }}>
              <h1>{card}</h1>
            </motion.div>
          : <motion.div key={index} style={cardStyle}>
              <h1>{card}</h1>
            </motion.div>
      ))}
      </div>
    </div>
  )
}

export default Hand
