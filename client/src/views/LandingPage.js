import { Grid, Typography, Container } from '@mui/material'
import React, { useState } from 'react'
import { useSocket } from '../websocket/useSocket'
import { useNavigate } from 'react-router-dom'
import forestScene from '../assets/forest_edited.png'
import MyButton from '../components/Button'
import MyTextField from '../components/TextField'

export default function LandingPage () {
  const socket = useSocket()

  const [code, setCode] = useState('')
  const [name, setName] = useState('')

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
    zIndex: -1
  }

  const joinDisabled = !(code && name)
  const createDisabled = !name

  const buttonStyles = {
    width: '100%',
    background: 'linear-gradient(to bottom, rgba(255, 233, 200, 1) 0%, rgba(255, 220, 180, 1) 50%, rgba(255, 210, 170, 1) 100%)',
    border: '3px solid black',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
    textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease'
  }

  return (
    <div style={backgroundImageStyle}>
      <Container style={{ maxWidth: '700px', padding: '10px', paddingTop: '150px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create Or Join A Game
        </Typography>
        <Grid style={{ paddingTop: '30px' }} container spacing={2} justify="center">
          <Grid item xs={12}>
            <MyTextField label="Your Name" value={name} onChange={(e) => onNameChange(e)} />
          </Grid>
          <Grid item xs={12}>
            <MyTextField label="Room Code (Optional)" value={code} onChange={(e) => onCodeChange(e)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <MyButton onClick={joinGame} label="Join Game" disabled={joinDisabled} />
          </Grid>
          <Grid item xs={12} md={6}>
            <MyButton onClick={hostGame} label="Create Game" disabled={createDisabled} gradient='primary' />
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
