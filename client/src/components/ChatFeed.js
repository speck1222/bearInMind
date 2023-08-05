import React, { useEffect, useRef, useLayoutEffect } from 'react'
import { List, ListItem, ListItemText, Typography, Paper, Divider, InputBase, Button } from '@mui/material'
import { useSocket } from '../websocket/useSocket'

const ChatFeed = ({ gameId }) => {
  const socket = useSocket()
  const [messages, setMessages] = React.useState([])
  const [message, setMessage] = React.useState('')
  const chatBoxRef = useRef(null)

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage()
      event.preventDefault() // Prevent newline in the input field
    }
  }

  const sendMessage = () => {
    console.log('sending message', message)
    socket.emit('send message', gameId, message)
    setMessage('')
  }

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    socket.emit('fetch messages', gameId)

    socket.on('fetched messages', (messages) => {
      setMessages(messages)
    })
    socket.on('new message', (message) => {
      console.log('new message', message)
      setMessages((messages) => [...messages, message])
      scrollToBottom()
    })

    socket.on('countDown', (count) => {
      setMessages((messages) => [...messages, { message: count }])
      scrollToBottom()
    })

    return () => {
      socket.off('fetched messages')
      socket.off('new message')
    }
  }, [])

  return (
    <div style={{ opacity: '0.9', paddingTop: '10px', overflow: 'hidden' }}>
      <Paper style={{ border: '3px solid black', backgroundColor: '#FAF9F6' }} elevation={3}>
        <Paper ref={chatBoxRef} elevation={0} sx={{ backgroundColor: '#FAF9F6' }} style={{ minWidth: '350px', maxWidth: '600px', padding: '16px', height: '90px', overflow: 'auto' }}>
          <List style={{ }}>
            {messages.map((message, index) => (
              <ListItem style={{ padding: '1px 0' }} key={message.messageId}>
                <ListItemText primary={`${message.userName ? message.userName + ': ' : ''}${message.message}`} ref={index === messages.length - 1 ? chatBoxRef : null} />
              </ListItem>
            ))}
          </List>
        </Paper>
        <Divider />
        <Paper elevation={0} style={{ padding: '8px', backgroundColor: '#FAF9F6', display: 'flex' }}>
          <InputBase
            value={message}
            onKeyDown={handleKeyDown}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            style={{ width: '100%', padding: '8px', backgroundColor: '#FAF9F6' }}
          />
          <Button disabled={!message} onClick={sendMessage} variant="outline" color="primary" style={{ marginLeft: '8px' }}>
            Send
          </Button>
        </Paper>
      </Paper>
    </div>
  )
}

export default ChatFeed
