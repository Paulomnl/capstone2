const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ssaSchema = new Schema({

     cert_id: {
         type: String,
         required: true,
         trim: true
     }
 
}, {
    timestamps: true
});

const FirstSsa = mongoose.model('first_ssas', ssaSchema);

module.exports = FirstSsa;