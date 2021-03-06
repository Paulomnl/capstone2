import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import Barcode from '../Barcode';
import javascriptBarcodeReader from 'javascript-barcode-reader';
import jsQR from "jsqr";
import './webviewer.css';
import sample from '../../pdfs/sample.pdf'

const WebViewerPDFTron = () => {
  const viewer = useRef(null);
  const [viewerInstance, setViewerInstance] = useState(null);
  const [file, setFile] = useState(null);

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    if(file) {
      WebViewer(
        {
          path: '/webviewer/lib',
          initialDoc:
            file,
          fullAPI: true,
          disabledElements: ['ribbons', 'cropToolGroupButton']
        },
        viewer.current,
      ).then(async instance => {
        setViewerInstance(instance);
        const {
          docViewer,
          annotManager,
          Annotations,
          Tools,
          iframeWindow,
          PDFNet,
        } = instance;
        await PDFNet.initialize();
  
        const createSnipTool = docViewer => {
          const SnipTool = function () {
            Tools.RectangleCreateTool.apply(this, arguments);
            this.defaults.StrokeColor = new Annotations.Color('#ff0000');
            this.defaults.StrokeThickness = 2;
          };
          SnipTool.prototype = new Tools.RectangleCreateTool();
  
          return new SnipTool(docViewer);
        };
  
        const customSnipTool = createSnipTool(docViewer);
  
        instance.setToolbarGroup('toolbarGroup-Edit');
  
        // Register tool
        instance.registerTool({
          toolName: 'SnipTool',
          toolObject: customSnipTool,
          // Icon made by https://www.flaticon.com/authors/smalllikeart from https://www.flaticon.com/
          buttonImage: '../../../price.svg',
          buttonName: 'snipToolButton',
          tooltip: 'Snipping Tool',
        });
  
        // Add tool button in header
        instance.setHeaderItems(function (header) {
          header
            .getHeader('toolbarGroup-Edit')
            .get('cropToolGroupButton')
            .insertAfter({
              type: 'toolButton',
              toolName: 'SnipTool',
            })
            .insertAfter({
              type: 'actionButton',
              img:
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
              onClick: async () => {
                // flatten annotations
                const annots = await annotManager.exportAnnotations();
                const fdf_doc = await PDFNet.FDFDoc.createFromXFDF(annots);
                const doc = await docViewer.getDocument().getPDFDoc();
                await doc.fdfUpdate(fdf_doc);
                await doc.flattenAnnotations();
                annotManager.deleteAnnotations(annotManager.getAnnotationsList());
                docViewer.refreshAll();
                docViewer.updateView();
                docViewer.getDocument().refreshTextData();
              },
            });
        });
  
        customSnipTool.on('annotationAdded', annotation => {
          const pageIndex = annotation.PageNumber;
          // get the canvas for the page
          const iframeDocument = iframeWindow.document;
          const canvasMultiplier = iframeWindow.utils.getCanvasMultiplier();
          const pageContainer = iframeDocument.getElementById(
            'pageContainer' + pageIndex,
          );
          const pageCanvas = pageContainer.querySelector('.canvas' + pageIndex);
          const topOffset = parseFloat(pageContainer.style.top) || 0;
          const leftOffset = parseFloat(pageContainer.style.left) || 0;
  
          const zoom = docViewer.getZoom();
          const x = annotation.X * zoom - leftOffset;
          const y = annotation.Y * zoom - topOffset;
          const width = annotation.Width * zoom * canvasMultiplier;
          const height = annotation.Height * zoom * canvasMultiplier;
  
          const copyCanvas = document.createElement('canvas');
          copyCanvas.width = width;
          copyCanvas.height = height;
          const ctx = copyCanvas.getContext('2d');
          // copy the image data from the page to a new canvas so we can get the data URL
          ctx.drawImage(pageCanvas, x, y, width, height, 0, 0, width, height);
          const imageData = ctx.getImageData(0,0, width, height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
  
          if (code) {
            alert(`QR Code: ${code.data}`);
          } else {
            javascriptBarcodeReader({
              image: copyCanvas,
              barcode: 'code-128',
            })
              .then(result => {
                alert(`Barcode: ${result}`);
              })
              .catch(console.log);
          }
  
          const annotManager = docViewer.getAnnotationManager();
          annotManager.deleteAnnotation(annotation);
        });
      });
    }
    
  }, [file]);

  const closeWebviewer = () => {
    viewerInstance.PDFNet.destroy();
  }

  const onFileReady = (dataURL) => {
    if(file) {
      if(file !== dataURL){
        closeWebviewer();
        setViewerInstance(null);
        setFile(dataURL);
      }
    }else {
      setFile(dataURL);
    }
    
  }

  return (
    <div className="container">
      <div className="webviewer" ref={viewer}></div>
      <Barcode instance={viewerInstance} onFileReady={onFileReady} />
    </div>
  );
};

export default WebViewerPDFTron;
