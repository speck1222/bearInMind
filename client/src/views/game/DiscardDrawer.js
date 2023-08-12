import { Drawer, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import React, { useState } from 'react'

const DiscardDrawer = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }
  return (
    <div>
      <IconButton onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="right" // Change this to 'right' for a right-side drawer
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        {/* Content of the drawer goes here */}
        <div
          style={{ width: 300, height: '630px' }} // You can adjust the width here
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          {/* Your drawer content goes here */}
        </div>
      </Drawer>
      {/* Rest of your component */}
    </div>
  )
}

export default DiscardDrawer
