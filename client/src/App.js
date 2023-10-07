import React, { useState } from 'react'
import './App.css'
import { useSocket } from './websocket/useSocket'
import LandingPage from './views/LandingPage'
import ButtonAppBar from './components/AppBar'
import GamePage from './views/game/GamePage'
import WaitingRoom from './views/WaitingRoom'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MyButton from './components/Button'

function App () {
  const [socketAlert, setSocketAlert] = useState(null)
  const socket = useSocket()
  const [gameStarted, setGameStarted] = useState(false)
  const [gameState, setGameState] = useState(null)
  const [me, setMe] = useState(null)

  function handleCloseAlert () {
    setSocketAlert(null)
  }

  React.useEffect(() => {
    socket.emit('fetch me')

    socket.on('fetched me', (me) => {
      setMe(me)
      if (me.gameStarted) {
        setGameStarted(Number(me.gameStarted))
      }
    })

    socket.on('start game', () => {
      setGameStarted(1)
    })

    socket.on('alert', (type, message) => {
      const data = { type, message }
      setSocketAlert(data)
    })
    socket.on('fetched game state', (gameState) => {
      setGameState(gameState)
    })
    return () => {
      socket.off('alert')
      socket.off('fetched me')
      socket.off('fetched game state')
      socket.off('start game')
    }
  }, [])
  if (!me) return (<div>Loading...</div>)

  const renderPage = () => {
    if (me.currentGame && !gameStarted) {
      return <div><ButtonAppBar/><WaitingRoom gameId={me.currentGame} me={me}/></div>
    } else if (me.currentGame && gameStarted) {
      return <GamePage gameId={me.currentGame} me={me}/>
    } else {
      return <div><ButtonAppBar/><LandingPage/></div>
    }
  }

  return (
      <div className="App" >
        {socketAlert && (
          <AlertModal open={true} type={socketAlert.type} message={socketAlert.message} handleClose={handleCloseAlert}/>
        )}
        {renderPage()}
      </div>
  )
}

function AlertModal ({ open, handleClose, type, message, title = '' }) {
  const modalStyle = {
    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(240, 240, 240, 1) 50%, rgba(230, 230, 230, 1) 100%)',
    border: '3px solid black',
    borderRadius: '20px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
    fontWeight: 'bold',
    fontSize: '18px',
    fontFamily: "'Comic Sans MS', cursive, sans-serif"
  }
  if (type === 'error') {
    title = 'Oh no!'
  }

  return (
    <Dialog sx={{
      '& .MuiDialog-paper': {
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(240, 240, 240, 1) 50%, rgba(230, 230, 230, 1) 100%)',
        border: '3px solid black',
        borderRadius: '20px', // This controls the roundness of the corners
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        fontWeight: 'bold',
        fontSize: '18px'
      }
    }} open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {message}
        </DialogContent>
        <DialogActions>
          <MyButton onClick={handleClose} label="Close" width='80px' />
        </DialogActions>
    </Dialog>
  )
}

export default App
