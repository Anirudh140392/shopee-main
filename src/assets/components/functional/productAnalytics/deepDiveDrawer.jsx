import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

export default function DeepDiveDrawer({ open, setOpen }) {

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerContent = (
    <Box sx={{ width: 1300 }} role="presentation" onClick={toggleDrawer(false)}>
      <h1>Deep Dive Product</h1>
    </Box>
  );

  return (
    <div>
      <Drawer anchor='right' open={open} onClose={toggleDrawer(false)}>
        {DrawerContent}
      </Drawer>
    </div>
  );
}