import React, { useRef, useState, useEffect } from 'react'
import { motion, useAnimation, useForceUpdate, useTransform } from 'framer-motion'
import MyButton from '../../components/Button'
import zIndex from '@mui/material/styles/zIndex'
import { drawerClasses, duration } from '@mui/material'

const containerStyle = {
  display: 'flex',
  width: '100%',
  padding: '10px 0',
  whiteSpace: 'nowrap',
  position: 'relative',
  marginTop: '40px'
}

const Hand = ({ cards, constraintsRef, playCard }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [cardIsReturning, setCardIsReturning] = useState(false)
  const controls = useAnimation()
  async function onDragEnd (event, info) {
    // Example: Check if the card was dropped in a specific area (e.g., x > 200 and y > 200)
    if ((info.point.x > 136 && info.point.x < 290) && info.point.y < 212) {
      setIsPlaying(true)
      // Trigger your event here
      controls.start({
        y: -399,
        x: 98,
        transition: {
          duration: 0.2
        }
      })
      await new Promise(resolve => setTimeout(resolve, 200))
      playCard(cards[0])
      controls.start({
        y: 0,
        x: 0,
        transition: {
          duration: 0
        }
      })
    } else {
      setIsPlaying(false)
      controls.start({
        x: 0,
        y: 0
      })
    }
  }

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
    paddingLeft: '10px',
    border: '2px solid black',
    backgroundColor: 'green',
    borderRadius: '5px',
    width: '130px',
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
    <div style={{ marginTop: '200px' }} >
      <div style={containerStyle} >
        <div style={cardHolderStyle}>
          {cards[0] && <motion.div
            style={{ ...firstCardStyle }}
            onDragEnd={onDragEnd}
            dragElastic='false'
            drag
            dragConstraints={constraintsRef}
            animate={controls}
          >
            <h1>{cards[0]}</h1>
          </motion.div>}

        </div>
        <motion.div style={containerStyle} drag='x' dragConstraints={{ top: 0, right: 0, bottom: 0, left: -((cards.length * 110)) }}>
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
