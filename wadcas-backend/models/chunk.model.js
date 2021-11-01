const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chunkSchema = new Schema({

     keyOne: {
         type: String,
         required: true,
         trim: true
     },
     keyTwo: {
      type: String,
      required: true,
      trim: true
     },
     keyThree: {
        type: String,
        required: true,
        trim: true
       }
 
}, {
    timestamps: true
});

const Chunk = mongoose.model('chunk', chunkSchema);

module.exports = Chunk;