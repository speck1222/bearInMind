import React, { useCallback, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { useSocket } from './websocket/useSocket'
import LandingPage from './views/LandingPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ButtonAppBar from './components/AppBar'
import GamePage from './views/GamePage'
import HostPage from './views/HostPage'
import JoinPage from './views/JoinPage'
import { useFetch } from './utils/useFetch'
import { Alert } from '@mui/material'
import { v4 as uuidv4 } from 'uuid'
import WaitingRoom from './views/WaitingRoom'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

function App () {
  const [socketAlert, setSocketAlert] = useState(null)
  const socket = useSocket()

  function handleCloseAlert () {
    setSocketAlert(null)
  }

  React.useEffect(() => {
    socket.on('alert', (type, message) => {
      const data = { type, message }
      setSocketAlert(data)
    })
    socket.on('leave game', () => {
      window.location.href = '/'
    })
    return () => {
      socket.off('alert')
    }
  }, [socketAlert])

  return (
      <div className="App">
        {socketAlert && (
          <AlertModal open={true} type={socketAlert.type} message={socketAlert.message} handleClose={handleCloseAlert}/>
        )}
        <ButtonAppBar/>

        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LandingPage/>}/>
            <Route path='/game' element={<GamePage/>}/>
            <Route path='/host/:gameId' element={<HostPage/>}/>
            <Route path='/join' element={<JoinPage/>}/>
            <Route path='/waiting-room/:gameId' element={<WaitingRoom/>}/>
          </Routes>
        </BrowserRouter>
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
        fontSize: '18px',
        fontFamily: "'Comic Sans MS', cursive, sans-serif"
      }
    }} open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {message}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            style={{ ...modalStyle, backgroundColor: 'rgb(255, 233, 200)' }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)'
            }}
          >
            Close
          </Button>
        </DialogActions>
    </Dialog>
  )
}

export default App
