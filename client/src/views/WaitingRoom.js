import { Paper, Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, Button } from '@mui/material'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSocket } from '../websocket/useSocket'
import ChatFeed from '../components/ChatFeed'
import forestScene from '../assets/simple_forest.png'

export default function WaitingRoom () {
  const { gameId } = useParams()
  const socket = useSocket()
  const [players, setPlayers] = useState([])
  const [isHost, setIsHost] = useState(false)
  const [me, setMe] = useState(null)

  function leaveGame () {
    socket.emit('leave game', gameId)
  }

  React.useEffect(() => {
    socket.emit('fetch me', gameId)
    socket.emit('fetch players', gameId)

    socket.on('fetched me', (player) => {
      console.log('This is me', player)
      setMe(player)
      setIsHost(player.isHost)
    })
    socket.on('fetched players', (players) => {
      setPlayers(players)
      console.log(players)
    })
    socket.on('player joined', (player) => {
      console.log(player)
    })
    return () => {
      socket.off('fetched players')
      socket.off('player joined')
    }
  }, [])

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

  const messages = [
    { sender: 'John', text: 'Hey' },
    { sender: 'Jane', text: 'Hi' },
    { sender: 'John', text: 'How are you?' },
    { sender: 'Jane', text: 'I\'m good, how are you?' }
  ]

  if (!players || !me) return (<div>Loading...</div>)

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
        <Paper style={{ minWidth: '355px', maxWidth: '600px', margin: '20px', padding: '10px', backgroundColor: '#488A60', marginTop: '80px' }}>
          <Container style={{ padding: '10px' }}>
            <Typography color='white' variant="h4" align="center" gutterBottom>
              Waiting Room
            </Typography>
            <Typography color='white' variant="h5" align="center" gutterBottom>Room Code: <Typography variant='h4' color='peachpuff'>{gameId}</Typography></Typography>

            <List style={{ marginBottom: '20px', backgroundColor: '#ffffff' }}>
              {players.map((player, index) => (
                <div key={player.userId}>
                  <ListItem button>
                    <ListItemAvatar>
                      <Avatar>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={`${player.userName}${player.isHost ? ' (Host)' : player.userId === me.userId ? ' (you)' : ''}`} />
                  </ListItem>
                  {index < players.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          </Container>
        </Paper>
        <Button
          variant="contained"
          color="warning"
          onClick={leaveGame}
        >
          Leave Game
        </Button>
        <ChatFeed messages={messages} gameId={gameId} currentUserId={me.userId} />
      </div>
    </div>
  )
}
