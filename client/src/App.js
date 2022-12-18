import React, { useCallback } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useSocket } from "./websocket/useSocket";

function App() {
  const [data, setData] = React.useState(null);
  const api_url = process.env.NODE_ENV === 'production' ? 'https://bear-in-mind-backend.game.peckappbearmind.com' : 'http://localhost:3001'
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
  }, [socket, onMessage])

  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>{!data ? "Loading..." : data}</p>
        </header>
      </div>
  );
}

export default App;