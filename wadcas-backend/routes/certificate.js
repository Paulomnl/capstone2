const router = require('express').Router();
var _ = require('lodash')
const IdGenerator = require('auth0-id-generator');
let Certificate = require('../models/certificate.model');
let Ssa = require('../models/ssa.model');
let FirstSsa = require('../models/first_ssa.model');
let SecondSsa = require('../models/second_ssa.model');
let Chunk = require('../models/chunk.model');

// home
router.route('/').get((req, res)=> {

    Certificate.find()
        .count()
        .then(certificate => res.json(certificate))
        .catch(err => res.status(400).json('Error :' + err));

});

// add certificate
router.route('/add').post((req, res)=> {
    console.log(req);
    const fullname = req.body.fullname;
    const document_type = req.body.document_type;
    const program = req.body.program;

    // supplyin payload
    const newCertificate = new Certificate({fullname, document_type, program });

    newCertificate.save()
        .then(certificate => res.json(certificate))
        .catch(err => res.status(400).json('Error :' + err));
});

// adding ssa
router.route('/ssa/add').post((req, res)=> {

    const cert_id = req.body.cert_id;
    const fullname = req.body.fullname;

    var generator = new IdGenerator({len: 33, alphabet: 'abcdefghijklmnopqrstuvwxyz1234567890', prefix: '', separator: ''});
    const removeSpaces = str => str.replace(/\s/g, '');

    // Example
    const trim = removeSpaces(fullname);      // 'helloworld'
    // generate 33 characters
    const secret = generator.get();

    // initiating values for chunking sercret: 3 chunks with 11 characters each
    const size = 11;

    // save new secret////////////////////////
    
    const newSsa = new Ssa({cert_id, secret, fullname});
    newSsa.save();
    /////////////////////////////////////////

    // chunking
    const numChunks = Math.ceil(secret.length / size)
    const chunks = new Array(numChunks)

    // get chunks
    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = secret.substr(o, size)
    }

    // chunking + cert_id
    const map1 = chunks.map(chunk => chunk + '.' + cert_id + '.' + trim);

    const keyOne = map1[0];
    const keyTwo = map1[1];
    const keyThree = map1[2];

    // supplyin payload
    const newChunk = new Chunk({keyOne, keyTwo, keyThree });
    console.log(newChunk);
    newChunk.save()
        .then(chunk => res.json(chunk))
        .catch(err => res.status(400).json('Error :' + err));

});

//check if ssa exists
router.route('/chunk/:keyOne').get( async (req, res)=> {
    console.log(req.params);
    const chunk = Chunk.findOne( { keyOne: req.params.keyOne }).then(
        
        chunk_result => {
          if(chunk_result && chunk_result !== null) {
            let keyArray = [];
            new_result = _.pick(chunk_result, 'keyOne', 'keyTwo', 'keyThree');
            Object.values(new_result).forEach(item => keyArray.push(item));
            const input1 = keyArray.map(input => input.split('.')[0]);
            
            const decode = input1[0]+input1[1]+input1[2];

            console.log(decode);

            if(decode) {
                const check = Ssa.findOne({ secret: decode}).then(
                    item_check => {
                        console.log('test_ss',item_check);
                        if(item_check) {
                            const check_cert = Certificate.findOne( { _id: item_check.cert_id }).then(
                                final_result => {
                                    console.log('test_cert',final_result)
                                    return res.json(final_result);
                                }
                            ).catch(err => {
                                res.status(400).send(err);
                            });
                        } else {
                            res.status(400).send(err);
                        }
                    }
                ).catch(err => {
                    res.status(400).send(err);
                });
            }
          } else {
              let err = 'doesnt exist';
              console.log(err);
              return res.status(400).send(err);
          }
            

            // const check = Ssa.findOne({ secret: decode}).then(
            //     item_check => {
            //         console.log(item_check);
            //         if(item_check && item_check !== null) {
            //             const third_cert = Certificate.findOne( { cert_id: item_check.cert_id }).then(
            //                 final_result => {
            //                     return res.json(final_result);
            //                 }
            //             ).catch(err => {
            //                 res.status(400).send(err);
            //             });
            //         } else {
            //             res.status(400).send(err);
            //         }
            //     }
            // ).catch(err => {
            //     res.status(400).send(err);
            // });

        }
    ).catch(err => {
        console.log('test', err);
        return res.status(400).send(err);
    });
    
});


// details
router.route('/:id').get((req, res)=> {
    Certificate.findById(req.params.id)
    .then(certificate => res.json(certificate))
    .catch(err => res.status(400).json('Error: '+ err));
});

// delete
router.route('/:id').delete((req, res)=> {
    Certificate.findByIdAndDelete(req.params.id)
    .then(certificate => res.json('Record was deleted.'))
    .catch(err => res.status(400).json('Error: '+ err));
});

module.exports = router;