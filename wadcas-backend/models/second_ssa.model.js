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

const SecondSsa = mongoose.model('second_ssas', ssaSchema);

module.exports = SecondSsa;