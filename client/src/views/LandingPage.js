import { Paper, Button, TextField, Alert, Grid, Typography, Container } from '@mui/material'
import React, { useState } from 'react'
import { useSocket } from '../websocket/useSocket'
import { useNavigate } from 'react-router-dom'
import forestScene from '../assets/simple_forest.png'

export default function LandingPage () {
  const socket = useSocket()
  const navigate = useNavigate()

  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState(null)

  function onCodeChange (event) {
    const uppercaseValue = event.target.value.toUpperCase()
    setCode(uppercaseValue)
  }

  function onNameChange (event) {
    setName(event.target.value)
  }

  function joinGame () {
    socket.emit('join', code, name)
  }

  function hostGame () {
    console.log('hosting game')
    socket.emit('init game', name)
  }
  const backgroundImageStyle = {
    backgroundImage: `url(${forestScene})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: -1,
    paddingTop: '110px'
  }

  const joinDisabled = !(code && name)
  const createDisabled = !name

  React.useEffect(() => {
    socket.on('joined game', (gameId) => {
      navigate(`/waiting-room/${gameId}`)
    })
    return () => {
      socket.off('joined game')
    }
  }, [])

  return (
    <div style={backgroundImageStyle}>
      <Container style={{ padding: '10px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create Or Join A Game
        </Typography>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12} sm={6}>
            <TextField
              style={{ opacity: 0.8, backgroundColor: 'white', borderRadius: '4px' }}
              fullWidth
              variant="outlined"
              label="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={hostGame}
              disabled={createDisabled}
            >
              Create Game
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Room Code"
              value={code}
              onChange={(e) => onCodeChange(e)}
              style={{ opacity: 0.8, backgroundColor: 'white', borderRadius: '4px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={joinGame}
              disabled={joinDisabled}
            >
              Join Game
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
