const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ssaSchema = new Schema({

     cert_id: {
         type: String,
         required: true,
         trim: true
     },

     secret: {
        type: String,
        required: true,
        trim: true
    },

    fullname: {
        type: String,
        required: true,
        trim: true
    }
 
}, {
    timestamps: true
});

const Ssa = mongoose.model('ssas', ssaSchema);

module.exports = Ssa;