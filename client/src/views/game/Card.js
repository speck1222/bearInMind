import React, { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
const containerStyle = {
  display: 'flex',
  width: '100%',
  padding: '10px 0',
  whiteSpace: 'nowrap',
  position: 'relative',
  marginTop: '40px'
}

const Hand = ({ cards, constraintsRef, playCard, dropZoneBounds, startingCardRef, cardHolderPoints, color }) => {
  const controls = useAnimation()
  const draggableContainerRef = React.useRef(null)
  const [draggableWidth, setDraggableWidth] = useState(null)
  async function onDragEnd (event, info) {
    // Example: Check if the card was dropped in a specific area (e.g., x > 200 and y > 200)
    if (
      info.point.x > dropZoneBounds.left &&
      info.point.x < dropZoneBounds.right &&
      info.point.y > dropZoneBounds.top &&
      info.point.y < dropZoneBounds.bottom
    ) {
      console.log('Card was dropped in the drop zone!')
      console.log(cardHolderPoints)
      // Trigger your event here
      controls.start({
        ...cardHolderPoints,
        transition: {
          duration: 0.2
        }
      })
      playCard(cards[0])
      await new Promise(resolve => setTimeout(resolve, 200))

      controls.start({
        y: 0,
        x: 0,
        transition: {
          duration: 0
        }
      })
    } else {
      controls.start({
        x: 0,
        y: 0
      })
    }
  }

  useEffect(() => {
    const updateBounds = () => {
      if (draggableContainerRef.current && constraintsRef.current) {
        const containerBounds = draggableContainerRef.current.getBoundingClientRect()
        const containerWidth = (Math.abs(containerBounds.left) + Math.abs(containerBounds.right))
        setDraggableWidth(containerWidth)
      }
    }
    updateBounds()

    // Set up the event listener
    window.addEventListener('resize', updateBounds)

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', updateBounds)
    }
  }, [cards])

  const cardStyle = {
    border: '2px solid black',
    backgroundColor: color,
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
    backgroundColor: 'lightgray',
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
    <div style={{ marginTop: '0px' }} >
      <div style={containerStyle} >
        <div ref={startingCardRef} style={cardHolderStyle}>
          {cards[0] && <motion.div
            style={{ ...firstCardStyle }}
            onDragEnd={onDragEnd}
            dragElastic='false'
            whileDrag={{ scale: 1.2 }}
            drag
            dragConstraints={constraintsRef}
            animate={controls}
          >
            <h1>{cards[0]}</h1>
          </motion.div>}

        </div>
        <motion.div ref={draggableContainerRef} style={containerStyle} drag='x' dragConstraints={{ top: 0, right: 0, bottom: 0, left: -703 }}>
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
