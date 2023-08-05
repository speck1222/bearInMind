import { Paper } from '@mui/material'
import React from 'react'
import { useParams } from 'react-router-dom'

export default function GamePage () {
  return (
    <Paper>
        <h1>Game Page</h1>
        <p>Game ID: {useParams().gameId}</p>
    </Paper>
  )
}
