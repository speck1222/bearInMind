import { Paper, Button, TextField } from '@mui/material'
import React, { useState } from 'react'

export default function LandingPage () {
  const [code, setCode] = useState('')

  function onCodeChange (event) {
    setCode(event.target.value)
  }

  return (
    <Paper>
        <h1>Join or host a Game</h1>
        <h3>host game</h3>
        <Button variant="contained">Host</Button>
        <h3>Join game</h3>
        <TextField onChange={onCodeChange} value={code} id="outlined-basic" label="Enter Code" variant="outlined" />
        <Button variant="contained">Join</Button>
    </Paper>
  )
}
