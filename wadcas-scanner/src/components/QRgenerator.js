import React, {useState} from 'react'
import {Fab, TextField, TextareaAutosize, Grid} from '@material-ui/core'
import {ArrowBack, GetApp} from '@material-ui/icons'
import { Link } from "react-router-dom";
import QRcode from 'qrcode.react'
import axios from 'axios';

function QRgenerator() {
    const [qr, setQr] = useState('sample');
    const [name, setName] = useState('sample');
    const [program, setProgram] = useState('sample');
    const [documentType, setDocumentType] = useState('sample');

    const handleDocumentChange = (event) => {
        setDocumentType(event.target.value);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleProgramChange = (event) => {
        setProgram(event.target.value);
    };

    const saveHealth = async () => {
        let payload = { fullname: name, program: program, document_type: documentType };

        let res = await axios.post('http://localhost:5000/health/add', payload);
    
        let data = res.data;
        setQr(data._id);
        downloadQR();
        saveSsa(data._id);
        saveFirstSsa(data._id);
        saveSecondSsa(data._id);
    }

    const saveSsa = async (cert_id) => {
        let payload = { cert_id: cert_id };

        let res = await axios.post('http://localhost:5000/health/ssa/add', payload);
    
        let data = res.data;
        console.log('ssa', data._id);
    };

    const saveFirstSsa = async (cert_id) => {
        let payload = { cert_id: cert_id };

        let res = await axios.post('http://localhost:5000/health/first_ssa/add', payload);
    
        let data = res.data;
        console.log('ssa', data._id);
    };

    const saveSecondSsa = async (cert_id) => {
        let payload = { cert_id: cert_id };

        let res = await axios.post('http://localhost:5000/health/second_ssa/add', payload);
    
        let data = res.data;
        console.log('ssa', data._id);
    };
    
    const downloadQR = () => {
        const canvas = document.getElementById("myqr");
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "myqr.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        setQr('');
    };

    return (
      <div>
            <Link to="/">
            <Fab style={{marginRight:10}} color="primary">
                <ArrowBack/>
            </Fab>
            </Link>
            <span>QR Generator</span>
            
            <div style={{marginTop:30}}>
                <TextField onChange={handleNameChange} style={{width:320}}
                value={name} label="Name" size="large" variant="outlined" color="primary" 
                />
            </div>

            <div style={{marginTop:30}}>
                <TextField onChange={handleProgramChange} style={{width:320}}
                value={program} label="Program" size="large" variant="outlined" color="primary" 
                />
            </div>

            <div style={{marginTop:30}}>
                <TextField onChange={handleDocumentChange} style={{width:320}}
                value={documentType} label="Document" size="large" variant="outlined" color="primary" 
                />
            </div>

            <div>
                {
                    qr ?
                    <QRcode 
                        id="myqr"
                        value={qr} 
                        size={320}
                        includeMargin={true}
                    /> :
                    <p>No QR code preview</p>
                }
            </div>
            <div>
                {
                    qr ? 
                    <Grid container>
                        <Grid item xs={10}>
                        <TextareaAutosize
                            style={{fontSize:18, width:250, height:100}}
                            rowsMax={4}
                            defaultValue={name}
                            value={name}
                        />
                        </Grid>
                        <Grid item xs={2}>
                        <Fab onClick={saveHealth} style={{marginLeft:10}} color="primary">
                            <GetApp/>
                        </Fab>
                        </Grid>
                    </Grid> :
                    ''
                }
            </div>
      </div>
    );
  }
  
  export default QRgenerator;
  