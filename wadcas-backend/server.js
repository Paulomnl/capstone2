const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//routes
const CertificateRouter = require('./routes/certificate');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//mongo
const uri = process.env.ATLAS_URI
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Mongo started");
});

app.use('/certificate', CertificateRouter);

app.listen(port, () => {
    console.log(`Server is running in port: ${port}`);
})