import React from "react";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Button from '@mui/material/Button';

export default function SchemaModal({ visible, setSchemaModalVisible, schemaImageUrl }) {

  return (
    <Dialog
      open={visible} 
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="xl"
    >
      <DialogTitle id="alert-dialog-title">
      {"Graph Model"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          
        </DialogContentText>
        <div style={{ height: 'calc(100vh - 200px', textAlign: 'center'}}>
          <img style={{ height: '100%' }} src={schemaImageUrl}>
          </img>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {setSchemaModalVisible(false)}} autoFocus>Close</Button>
      </DialogActions>
    </Dialog>

  );
}