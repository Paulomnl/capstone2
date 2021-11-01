import React, { useState, useRef } from 'react';
import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import axios from 'axios';
import QRCode from 'qrcode';



function Template02() {

  const ComponentToPrint = React.forwardRef((props, ref) => (
    <div ref={ref} className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border-4 border-blue-900">
      <header className="px-5 py-4">
        <h4 className="text-gray-800 text-center font-serif">
          Republic of the Philippines<br/>
          School Name University <br/>
          College of Computer Studies
        </h4>

        <h4 className="italic text-gray-800 text-center pt-4 font-serif">this</h4>

        <h6 className="font-bold text-gray-800 text-6xl text-center font-sans">Academic Excellence</h6>
        <h4 className="italic text-gray-800 text-center font-serif">is proudly presented to</h4>
      </header>

      <div className="p-1">
        <header className="">
          <h4 className="font-bold text-blue-800 text-center font-serif text-6xl">{qrInput}</h4>
        </header>
      </div>

      <div className="p-1">
        <header className="px-16">
          <h6 className="italic font-semibold text-gray-800 text-center font-serif">In recognition of his/her excellent, efforts, and achievements in being an outstanding student during the
4th Quarter, Second Semester of Academic Year 2020-2021, qualifying him as a student

          </h6>
        </header>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3">
          <header className="px-5 py-2">
          <h6 className="font-semibold text-gray-800 text-center">(Name)(Title/Position)</h6>
          </header>
        </div>
        <div className="p-3">
        <div className="p-3">
            <div className="error">{errStampQrText}</div>
            <canvas className="qrCanvas" ref={qrStampRef}></canvas>
        </div>
        </div>
      </div>
    </div>
  ));

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const componentRef = useRef();
  const qrRef = useRef(null);
  const qrStampRef = useRef(null);
  const [errText, setErrText] = useState('');
  const [errQrText, setErrQrText] = useState('');
  const [errStampQrText, setStampErrQrText] = useState('');
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
    console.log(data)
    setGeneratedQr(data.keyOne);
  
    // QRCode.toCanvas(qrRef.current, data.keyOne, function (error) {
    //   if (error) setErrQrText(error);
    // });
  
  };

  const stampBarcode = () => {
    QRCode.toCanvas(qrStampRef.current, generatedQr, function (error) {
      if (error) setStampErrQrText(error);
    });
  
  };

  return (
    <React.Fragment>
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Welcome banner */}
            <WelcomeBanner />

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              {/* Table (Top Channels) */}
              <ComponentToPrint ref={componentRef} />

              <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-gray-200">
                <header className="px-5 py-4 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-800">Enter Values</h4>
                </header>

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
                          stampBarcode();
                        }}
                      >
                        Stamped QR
                      </button>
                    </div>
                  </div>


                  <div className="grid pt-2 grid-cols-12 gap-6">
                    <div class="col-span-full xl:col-span-2 pl-2">
                      <div className="error">{errQrText}</div>
                    </div>

                    <div class="col-span-full xl:col-span-8 pt-5">
                      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                        Generated Key: {generatedQr}
                      </label>
                    </div>
                  </div>

                  <div class="flex flex-col pb-4">
                    <button onClick={() => exportComponentAsPNG(componentRef)} class="bg-gray-500 hover:bg-gray-700 text-white font-bold pl-4 pb-4 pt-2 px-4 border border-blue-700 rounded">
                      Download PDF
                    </button>
                  </div>
                </div>
            </div>

          </div>
        </main>

      </div>
    </div>
    </React.Fragment>
  );
}

export default Template02;