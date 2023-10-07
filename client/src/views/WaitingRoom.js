import { Paper, Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, Button, Grid } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { CirclePicker } from 'react-color'
import { useParams, useNavigate } from 'react-router-dom'
import { useSocket } from '../websocket/useSocket'
import ChatFeed from '../components/ChatFeed'
import forestScene from '../assets/forest_edited.png'
import MyButton from '../components/Button'

export default function WaitingRoom ({ gameId, me }) {
  const socket = useSocket()
  const [players, setPlayers] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [availableColors, setAvailableColors] = useState([])
  const [showPicker, setShowPicker] = useState(false)
  const [myColor, setMyColor] = useState(me.color)

  function leaveGame () {
    socket.emit('leave game', gameId)
  }

  function startGame () {
    setGameStarted(true)
    socket.emit('start game', gameId)
  }

  React.useEffect(() => {
    socket.emit('fetch players', gameId)

    socket.on('fetched players', (data) => {
      console.log(data.players)
      setPlayers(data.players)
      setAvailableColors(data.availableColors)
    })
    return () => {
      socket.off('fetched players')
    }
  }, [availableColors])

  const backgroundImageStyle = {
    backgroundImage: `url(${forestScene})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    position: 'absolute',
    width: '100%',
    height: '100vh',
    top: 0,
    left: 0,
    zIndex: -1
  }

  if (!me) return (<div>Loading...</div>)

  const handleColorChange = (color, event) => {
    setMyColor(color.hex)
    setShowPicker(false)
    socket.emit('change color', gameId, color.hex)
    // Emit the color change to the server here, if needed
  }

  const togglePicker = () => {
    setShowPicker(!showPicker)
  }

  return (
    <div style={backgroundImageStyle}>
      <div style={{
        marginTop: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column'
      }}>
        <Paper style={{ opacity: '.9', minWidth: '355px', maxWidth: '600px', margin: '20px', padding: '10px', backgroundColor: '#09241F', marginTop: '100px', border: '2px solid black', borderRadius: '10px' }}>
          <Container style={{ padding: '10px' }}>
            <Typography color='white' variant="h4" align="center" gutterBottom>
              Waiting Room
            </Typography>
            <Typography color='white' variant="h5" align="center" gutterBottom>Room Code: <Typography variant='h4' color='peachpuff'>{gameId}</Typography></Typography>

            <List style={{ border: '3px solid black', borderRadius: '10px', marginBottom: '20px', backgroundColor: '#ffffff' }}>
              {players?.map((player, index) => (
                <div key={player.userId}>
                  <ListItem button>
                    {player.userId === me.userId
                      ? (
                        <>
                          {!showPicker && <Avatar style={{ backgroundColor: myColor, marginRight: '10px' }} onClick={togglePicker} />}
                          {showPicker
                            ? <CirclePicker color={myColor} onChangeComplete={handleColorChange} colors={availableColors} />
                            : <ListItemText primary={`${player.userName}${player.isHost ? ' (Host)' : ' (you)'}`} />}
                        </>
                        )
                      : (
                        <>
                          <Avatar style={{ backgroundColor: player?.color || '#ccc', marginRight: '10px' }} />
                          <ListItemText primary={`${player.userName}${player.isHost ? ' (Host)' : ''}`} />
                        </>
                        )
                    }
                  </ListItem>
                  {index < players.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          </Container>
        </Paper>
        <Grid maxWidth='415px' style={{ width: '355', padding: '10px' }} container spacing={2} alignItems="center" justify="center">
        <Grid item xs={me.isHost ? 6 : 12}>
            <MyButton onClick={leaveGame} label='Leave Game' gradient='warning' />
          </Grid>
          {me.isHost &&
            <Grid item xs={6}>
              <MyButton disabled={gameStarted} onClick={startGame} label='Start Game' gradient='primary' />
            </Grid>
          }
        </Grid>
        <ChatFeed gameId={gameId} currentUserId={me.userId} />
      </div>
    </div>
  )
}
