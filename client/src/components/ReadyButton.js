/* eslint-disable multiline-ternary */

import React, { useEffect, useState } from 'react'
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

export default ReadyButton
