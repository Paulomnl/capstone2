import React, { useState, useRef } from "react"
import { Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import QRCode from "qrcode.react"
import {Grid, Button, Typography} from '@material-ui/core';
import Icon from '@mdi/react'
import { mdiQrcode, mdiQrcodeScan } from '@mdi/js';
import ReactToPrint from 'react-to-print';

const Admin = () =>{
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  console.log(currentUser.claims);
  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>

      
      <div>
      <Typography style={{margin:30}} variant="h2">
      React QR Code
      </Typography>

      <Grid container spacing={6}>
          <Grid item xs={6}>
              <Link to="/qr_generator">
              <Button variant="contained" size="large" color="primary">
                  <Icon 
                  style={{padding:10}}
                  path={mdiQrcode}
                  title="QR Generator"
                  size={10}
                  color="white"
                  />
              </Button>
              </Link>
          </Grid>
          <Grid item xs={6}>
              <Link to="/qr_scanner">
              <Button variant="contained" size="large" color="primary">
                  <Icon 
                  style={{padding:10}}
                  path={mdiQrcodeScan}
                  title="QR Scanner"
                  size={10}
                  color="white"
                  />
              </Button>
              </Link>
          </Grid>
      </Grid>

      </div>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </>
  )
}

export default Admin;
