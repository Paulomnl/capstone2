const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scanDocSchema = new Schema({

     fullname: {
        type: String,
        required: true,
        trim: true
     },
     document_type: {
        type: String,
        required: true,
        trim: true
     },
     program: {
        type: String,
        required: true,
        trim: true
    },
    cert_id: {
        type: String,
        required: true,
        trim: true
     }
 
}, {
    timestamps: true
});

const ScanDoc = mongoose.model('scan_doc', scanDocSchema);

module.exports = ScanDoc;