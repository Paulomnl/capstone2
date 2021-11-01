import React, { useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import './barcode.css';
import Dropzone from '../actions/Dropzone';
import { tailwindConfig } from '../../utils/Utils';
import axios from 'axios';

const Barcode = ({ instance, onFileReady }) => {
  const barcodeRef = useRef(null);
  const qrRef = useRef(null);
  const formatRef = useRef(null);

  const [errText, setErrText] = useState('');
  const [errQrText, setErrQrText] = useState('');
  const [qrInput, setQrInput] = useState('');
  const [program, setProgram] = useState('sample');
  const [documentType, setDocumentType] = useState('sample');
  const [generatedQr, setGeneratedQr] = useState('');

  const saveHealth = async () => {
    try {
      let payload = { fullname: qrInput, program: program, document_type: documentType };

      let res = await axios.post('http://localhost:5000/certificate/add', payload);

      let data = res.data;
      saveSsa(data._id, data.fullname);

    } catch(err) {
      console.log(err);
    }
  }

const saveSsa = async (cert_id, fullname) => {
    let payload = { cert_id: cert_id, fullname: fullname };

    let res = await axios.post('http://localhost:5000/certificate/ssa/add', payload);

    let data = res.data;
    setGeneratedQr(data.keyOne);

    QRCode.toCanvas(qrRef.current, data.keyOne, function (error) {
      if (error) setErrQrText(error);
    });

    console.log('ssa', data.keyOne);
};

// const saveFirstSsa = async (cert_id) => {
//     let payload = { cert_id: cert_id };

//     let res = await axios.post('https://wadcas.herokuapp.com/health/first_ssa/add', payload);

//     let data = res.data;
//     console.log('ssa', data._id);
// };

// const saveSecondSsa = async (cert_id) => {
//     let payload = { cert_id: cert_id };

//     let res = await axios.post('https://wadcas.herokuapp.com/health/second_ssa/add', payload);

//     let data = res.data;
//     console.log('ssa', data._id);
// };


  const stampBarcode = (type) => {
    const { Annotations, annotManager, docViewer } = instance;
    const stampAnnot = new Annotations.StampAnnotation();
    stampAnnot.PageNumber = docViewer.getCurrentPage();
    stampAnnot.X = 100;
    stampAnnot.Y = 250;
    stampAnnot.Width = 300;
    
    if (type === '2d') {
      stampAnnot.ImageData = barcodeRef.current.toDataURL();
      stampAnnot.Height = 200;
    } else {
      stampAnnot.ImageData = qrRef.current.toDataURL();
      stampAnnot.Height = 300;
    }

    stampAnnot.Author = annotManager.getCurrentUser();
    annotManager.addAnnotation(stampAnnot);
    annotManager.redrawAnnotation(stampAnnot);
  };

  const onUpload = (file) => {
    onFileReady(file);
  }

  return (
    // <div className="barcodeContainer">
    //   <h2>QR Code</h2>
    //   <input
    //     onChange={e => {
    //       setQrInput(e.currentTarget.value);
    //     }}
    //     type="text"
    //   ></input>
      
      // <button
      //   onClick={e => {
      //     stampBarcode(e, 'qr');
      //   }}
      // >
      //   Stamp on a PDF
      // </button>

    //   <Dropzone onUpload={onUpload}/>
      
    // </div>

  <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-gray-200">
    <header className="px-5 py-4 border-b border-gray-100">
      <h4 className="font-semibold text-gray-800">Enter Values</h4>
    </header>

      <div class="flex flex-col pb-4">
        <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold pl-4 pb-4 pt-2 px-4 border border-blue-700 rounded">
        <Dropzone onUpload={onUpload}/>
        </button>
      </div>

    <div class="flex flex-wrap px-5 mb-6">
      <div class="w-full px-3">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
          Full Name
        </label>
        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" type="text"
          onChange={e => {
            setQrInput(e.currentTarget.value);
          }}
        />
      </div>
    </div>

    <div class="flex flex-wrap px-5 mb-6">
      <div class="w-full px-3">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
          Program
        </label>
        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text"
          onChange={e => {
            setProgram(e.currentTarget.value);
          }}
        />
      </div>
    </div>

    <div class="flex flex-wrap px-5 mb-6">
      <div class="w-full px-3">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
          Document Type
        </label>
        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text"
          onChange={e => {
            setDocumentType(e.currentTarget.value);
          }}
        />
      </div>
    </div>

    <div className="grid grid-cols-12 gap-6">
      <div class="col-span-full xl:col-span-6 pl-10">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold pb-4 pt-2 px-4 border border-blue-700 rounded" onClick={e => {saveHealth();}}>
          Generate Key
        </button>
      </div>

      <div class="col-span-full xl:col-span-6 pr-10">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold pb-4 pt-2 pl-3 pr-10 border border-blue-700 rounded"
          onClick={e => {
            stampBarcode('qr');
          }}
        >
          Stamped QR
        </button>
      </div>
    </div>


    <div className="grid pt-2 grid-cols-12 gap-6">
      <div class="col-span-full xl:col-span-4 pl-2">
        <div className="error">{errQrText}</div>
        <canvas className="qrCanvas" ref={qrRef}></canvas>
      </div>
    </div>

    <div class="col-span-full xl:col-span-8 pt-5">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 pl-2" for="grid-last-name">
          Generated Key: {generatedQr}
        </label>
      </div>
  </div>
  );
};

export default Barcode;
