import React, {useState} from 'react'
import {Fab, TextareaAutosize} from '@material-ui/core'
import {ArrowBack} from '@material-ui/icons'
import { Link, useHistory } from "react-router-dom";
import QrScan from 'react-qr-reader'
import { useAuth } from "../contexts/AuthContext"
import {Grid, Typography, Box, Modal, Card, CardContent, CardActions, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import axios from 'axios';
import { Button } from "react-bootstrap"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const buttonStyle = {
  marginTop: '100px'
};



function QRscanner() {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [msg, setMsg] = useState("");
    
  const history = useHistory()
  const { currentUser, logout } = useAuth()
  const [error, setError] = useState("")
  const [qrscan, setQrscan] = useState('');
  const [dpa, setDpa] = useState(false);

  const handleScan = data => {
    console.log('test', data);
    if (data) {
      axios.get('http://localhost:5000/certificate/chunk/' + data)
        .then(res => {
          console.log('test', res.data);
            if (res.data) {
              setMsg('This Certificate Belongs to:' + res.data.fullname);
              handleOpen();
            } else {
              setMsg('This Certificate Does Not Exist');
              handleOpen();
            }
        })
        .catch(error => {
            setMsg('This Certificate Does Not Exist');
            handleOpen();
            console.log(error);
        })
      }
  }

  const handleDpa = () => {
    setDpa(true);
  }

    const handleError = err => {
    console.error(err)
    }

    async function handleLogout() {
      setError("")
  
      try {
        await logout()
        history.push("/login")
      } catch {
        setError("Failed to log out")
      }
    }

    return (
      <>
      <div>
        <center>
          <div>
            <span>QR Scanner</span>
            
              <QrScan
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ height: 240, width: 320 }}
              />
          </div>
        </center> 
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Notification
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {msg}
          </Typography>
        </Box>
      </Modal>
    </div>

    <div>
      <div className="text-center mt-100">
        <Button style={buttonStyle} onClick={handleLogout} className="mt-100 w-50">
          Logout
        </Button>
      </div>
    </div>
    </>
    );
  }
  
  export default QRscanner;
  