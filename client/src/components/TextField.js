import React from 'react'
import { TextField } from '@mui/material'

function MyTextField ({ label, value, onChange }) {
  return (
    <input
      style={{
        paddingLeft: '10px',
        width: '95%',
        height: '50px',
        opacity: 1,
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(240, 240, 240, 1) 50%, rgba(230, 230, 230, 1) 100%)',
        border: '3px solid black',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        fontWeight: 'bold',
        fontSize: '18px' // or another cartoony font
      }}
      placeholder={label}
      label={label}
      value={value}
      onChange={onChange}
  />
  )
}

export default MyTextField
