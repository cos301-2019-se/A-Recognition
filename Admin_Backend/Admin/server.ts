// server.js

const path = require('path');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser')
let {PythonShell} = require('python-shell');

const app = express();

const DIR = './';
 
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
    }
});
let upload = multer({storage: storage});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
 
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
 
app.get('/', function (req, res) {
  res.end('file catcher example');
});
 
app.post('/add',upload.single('photo'), function (req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.send({
          success: false
        });
      }
       else {
        console.log('file received');
        console.log(req.file);
        
        return new Promise( (resolve,reject) =>{
            let options = {
                mode: 'text',
                pythonOptions: ['-u'], // get print results in real-time
                scriptPath: '../../Facial_Recogntion/',
                args: [req.file]
            };
            PythonShell.run('/encodingBackup.py', options, function (err, results) {
            if (err) throw err;
            console.log('results: %j', results);
            });
        });
        // return res.send({            
        //   success: true
        // })
      }
});
 
const PORT = process.env.PORT || 2999;
 
app.listen(PORT, function () {
  console.log('Node.js server is running on port ' + PORT);
});