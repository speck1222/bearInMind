import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import bearLogo from '../assets/Bear_playing_card_transparent_cropped.png'

export default function ButtonAppBar () {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            Bear In Mind
          </Typography>
      <img src={bearLogo} alt="bear logo" style={{ paddingBottom: '20px', width: '60px' }}/>
      {/* <AppBar style={{ opacity: 0.8, backgroundColor: '#8B4513' }} position="static">
        <Toolbar>
          <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
            Bear In Mind
          </Typography>
          <img src={bearLogo} alt="bear logo" style={{ padding: '10px', height: '80px' }}/>
        </Toolbar>
      </AppBar> */}
    </Box>
  )
}
