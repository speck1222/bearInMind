import { Paper, Button, TextField, Alert } from '@mui/material'
import React, { useState } from 'react'
import { useSocket } from '../websocket/useSocket'
import { useNavigate } from 'react-router-dom'

export default function LandingPage () {
  const socket = useSocket()
  const navigate = useNavigate()

  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState(null)

  function onCodeChange (event) {
    setCode(event.target.value)
  }

  function onNameChange (event) {
    setName(event.target.value)
  }

  function joinGame () {
    socket.emit('join', code, name)
  }

  function hostGame () {
    socket.emit('init game')
  }

  const joinDisabled = !(code && name)

  React.useEffect(() => {
    socket.on('joined game', (gameId) => {
      navigate(`/waiting-room/${gameId}`)
    })
    return () => {
      socket.off('joined game')
    }
  }, [])

  return (
    <Paper>
        <h1>Join or host a Game</h1>
        <h3>host game</h3>
        <Button onClick={hostGame} variant="contained">Host</Button>
        <h3>Join game</h3>
        <TextField onChange={onCodeChange} value={code} id="outlined-basic" label="Enter Code" variant="outlined" />
        <TextField onChange={onNameChange} value={name} id="outlined-basic" label="Enter Name" variant="outlined" />
        <Button onClick={joinGame} disabled={joinDisabled} variant="contained">Join</Button>    </Paper>
  )
}
