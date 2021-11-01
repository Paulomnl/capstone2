import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

function Dropzone({onUpload}) {


    const onDrop = useCallback((acceptedFiles) => {
        
        let file = acceptedFiles[0];
        
        const reader = new FileReader()

        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result
        onUpload(binaryStr)
        }
        reader.readAsDataURL(file)
        
    }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Click to add File</p>
      }
    </div>
  )
}

export default Dropzone;