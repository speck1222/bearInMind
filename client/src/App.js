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
        <ButtonAppBar/>
        {socketAlert && (
          <Alert
            onClose={handleCloseAlert}
            severity={socketAlert.type}
          >
            {socketAlert.message}
          </Alert>
        )}
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

export default App
