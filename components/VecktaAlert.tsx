import React, { useState } from 'react';
import Alert, { AlertProps } from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

export const alertSx = {
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '& .MuiAlert-action': { padding: 0 },
  '& .MuiSvgIcon-root': { color: 'inherit' },
};

export default function VecktaAlert({ children, action, ...props }: AlertProps) {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={open} sx={{ mb: 2 }}>
        <Alert
          action={
            action || (
              <IconButton
                aria-label='close'
                color='inherit'
                size='small'
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize='inherit' />
              </IconButton>
            )
          }
          sx={alertSx}
          {...props}
        >
          {children}
        </Alert>
      </Collapse>
    </Box>
  );
}
