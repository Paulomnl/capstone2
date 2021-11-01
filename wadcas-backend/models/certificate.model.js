const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const certificateSchema = new Schema({

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
    }
 
}, {
    timestamps: true
});

const Certificate = mongoose.model('certificate', certificateSchema);

module.exports = Certificate;