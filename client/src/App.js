import React, { useCallback } from 'react'
import logo from './logo.svg'
import './App.css'
import { useSocket } from './websocket/useSocket'
import LandingPage from './views/LandingPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ButtonAppBar from './components/AppBar'
import GamePage from './views/GamePage'
import HostPage from './views/HostPage'
import JoinPage from './views/JoinPage'

function App () {
  const [data, setData] = React.useState(null)
  const socket = useSocket()

  const onMessage = useCallback((message) => {
    console.log(message)
    setData(message)
  }, [])

  React.useEffect(() => {
    socket.on('hello', onMessage)
    return () => {
      socket.off('hello', onMessage)
    }
  }, [])

  return (
      <div className="App">
        <ButtonAppBar/>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LandingPage/>}/>
            <Route path='/game' element={<GamePage/>}/>
            <Route path='/host' element={<HostPage/>}/>
            <Route path='/join' element={<JoinPage/>}/>
          </Routes>
        </BrowserRouter>
      </div>
  )
}

export default App
