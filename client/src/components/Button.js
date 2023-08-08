import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { green } from '@mui/material/colors'

function MyButton ({ onClick, label, disabled, gradient, width }) {
  const [isPressed, setIsPressed] = useState(false)
  const altGradient = 'linear-gradient(to bottom, rgba(255, 233, 200, 1) 0%, rgba(255, 220, 180, 1) 50%, rgba(255, 210, 170, 1) 100%)'
  const primaryGradient = 'linear-gradient(to bottom, rgba(0, 255, 0, 1) 0%, rgba(0, 191, 0, 1) 50%, rgba(0, 127, 0, 1) 100%)'
  const warningGradient = 'linear-gradient(to bottom, rgba(255, 190, 0, 1) 0%, rgba(255, 140, 0, 1) 50%, rgba(204, 85, 0, 1) 100%)'
  const greenGradient = 'linear-gradient(to bottom, rgba(0, 255, 0, 1) 0%, rgba(0, 191, 0, 1) 50%, rgba(0, 127, 0, 1) 100%)'

  const gradientStyle = gradient === 'primary' ? primaryGradient : gradient === 'warning' ? warningGradient : altGradient

  const handleTouchStart = () => {
    if (window.innerWidth <= 768) { // Check if the device is a mobile or tablet
      setIsPressed(true)
    }
  }

  const handleTouchEnd = () => {
    if (window.innerWidth <= 768) { // Check if the device is a mobile or tablet
      setIsPressed(false)
    }
  }

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)'
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)'
      }}
      style={{
        opacity: disabled ? 0.5 : 1,
        width: width || '100%',
        background: gradientStyle,
        border: '3px solid black',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease',
        // Hover effect for non-touch devices
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': {
            transform: 'scale(1.1)'
          }
        }
      }}
    >
      <Typography color='black' >
        {label}
      </Typography>
    </Button>
  )
}

export default MyButton
