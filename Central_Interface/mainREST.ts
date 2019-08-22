/** 
 * Filename: mainREST.ts
 * Version: V1.0
 * Author: JJ Goschen
 * Project name: A-Recognition (Advance)
 * Organization: Singularity
 * Funtional description: Provides an api to access main.ts functions
*/
//npm install express --save
//pip3 install firebase-admin
//pip3 install firebase
import * as Main from "./main";
import * as fs from "fs";
import express = require("express");
import cors = require('cors');
import multer = require('multer');
let upload = multer({ dest: './Facial_Recogntion/' })
var app = express();

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(cors());
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);

app.listen(process.env.PORT || 3000, () => {
 console.log("Server running");
});

var LOCAL = true;

app.post("/getUsersFromDaysEvents", (req, res) => { 
    Main.getUsersFromDaysEvents(LOCAL).then( users => res.json(users)).catch( err => res.send(err));
});

app.post("/validateUserHasBooking", (req, res, next) => {
    
    if(req["body"].hasOwnProperty("email") && req["body"].hasOwnProperty("room")){
        
        let email = req["body"].email;
        let room = req["body"].room;

        Main.validateUserHasBooking(email,room).then( msg => {res.send(msg);console.log(msg)}).catch( err => res.send(err));
    }else{
        res.send("Please send email and room name");
    }    
});

app.post('/getEmails', (req, res) => {

    Main.getEmployeeEmails().then( employees =>{
        res.json(employees);
    }).catch( err => res.send(err));
});

app.post('/isEmployee', (req, res) => {
    
    if(!req["body"].hasOwnProperty("email"))
        res.send("Please send a valid email");
    else
        Main.isEmployee(req["body"].email).then( result =>{
            res.send(result);
        }).catch( result=>{
            res.send(result);
        });
    
});
/** 
 * Function Name:addEmployee
 * Version: V1.0
 * Author: Richard McFadden
 * Funtional description: takes in formdata which contains everything
 * needed to add a new user.
*/
app.post('/addEmployee',upload.single('image'), (req, res) => {
    //await delay(1000);
    res.json(Main.addEmplpoyee(req)); 
});
/** 
 * Function Name:getEmployeeList
 * Version: V1.0
 * Author: Richard McFadden
 * Funtional description: list of employees
*/
app.post('/getEmployeeList',(req,res)=>
{
    Main.getEmployeeList().then( users => res.json(users)).catch( err => res.send(err));; 
});
/** 
 * Function Name:getTitle
 * Version: V1.0
 * Author: Richard McFadden
 * Funtional description: sends back the title of the loggedin person
*/
app.post('/getTitle',(req,res)=>
{
    if(req["body"].hasOwnProperty("email") != true)
    {
        res.send("Invalid email");
    }
    else{
        console.log(req.query.email);
        console.log(req["body"].email);
        res.send(Main.getTitle(req["body"].email));
    }
});

app.post('/generateToken', (req, res) => {
    if( req["body"].hasOwnProperty("sender") != true)
    res.send("Invalid sender");
    else
    res.send(Main.generateToken(req["body"].sender));
});

app.post('/verifyToken', (req, res) => {
  
    if( req.query.hasOwnProperty("token") != true)
    res.send("Invalid token");
    else
    Main.verifyToken(req.query.token)
    .then( success => res.send(success) )
    .catch( err => res.send(err));
});

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

app.post('/getEventList',(req,res) => {

    Main.getEventList().then( events =>{
        res.json(events);
    })
});

app.post('/generateOTP',(req,res) => {

    console.log(req["body"].eventId);
    if(req["body"].hasOwnProperty("eventId"))
            (Main.generateOTP(req["body"].eventId, req['body'].broadcast)).then(success => { res.send(success)}).catch(err => res.send(err));
    else
        res.send("Invalid event ID supplied");
    
});

app.post('/validateOTPByRoom', (req,res) => {

    if(req["body"].hasOwnProperty("roomID"))
    if(req["body"].hasOwnProperty("otp"))
        Main.validateRoomOTP(req["body"].roomID,req["body"].otp)
        .then( entryAllowed => res.send(entryAllowed))
        .catch( entryDenied => res.send(entryDenied));
    else 
        res.send("Invalid otp");
else
    res.send("Invalid room ID supplied");
});

app.post('/validateOTP',(req,res) => {
    if(req["body"].hasOwnProperty("eventId"))
        if(req["body"].hasOwnProperty("otp"))
            Main.validateOTP(req["body"].eventId,req["body"].otp)
            .then( entryAllowed => res.send(entryAllowed))
            .catch( entryDenied => res.send(entryDenied));
        else 
            res.send("Invalid otp");
    else
        res.send("Invalid eventId supplied");
});

app.get('/', (req, res) => {

    fs.readFile(__dirname+'/index.html', function (err, html) {
        if (err) 
            throw err; 
        
        res.writeHead(200, {"Content-Type": "text/html"});  // <-- HERE!
        res.write(html);  // <-- HERE!
        res.end();  
        
    });
});