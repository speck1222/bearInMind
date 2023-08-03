import { Paper, Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, Button } from '@mui/material'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSocket } from '../websocket/useSocket'

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

  if (!players) return (<div>Loading...</div>)

  return (
    <div style={{
      marginTop: '50px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      flexDirection: 'column'
    }}>
      <Paper style={{ width: '600px', margin: '20px', padding: '10px' }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom>
            Waiting Room
          </Typography>
          <Typography variant="h5" align="center" gutterBottom>Room Code: {gameId}</Typography>

          <List style={{ backgroundColor: '#ffffff' }}>
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
    </div>
  )
}
