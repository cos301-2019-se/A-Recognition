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

import express = require("express");
import fs = require('fs');
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

app.listen(3000, () => {
 console.log("Server running on port 3000");
});


app.post("/getUsersFromDaysEvents", (req, res) => { 
    Main.getUsersFromDaysEvents().then( users => res.json(users)).catch( err => res.send(err));
});

app.get("/getUsersFromDaysEvents", (req, res) => { 
    Main.getUsersFromDaysEvents().then( users => res.json(users)).catch( err => res.send(err));
});

app.post("/validateUserHasBooking", (req, res, next) => {

    let email;
    let room;

    
    if(req.query.hasOwnProperty("email") && req.query.hasOwnProperty("room")){
        
        email = req.query.email;
        room = req.query.room;

        Main.validateUserHasBooking(email,room).then( msg => {res.send(msg);console.log(msg)}).catch( err => res.send(err));
    }else{
        res.send("Please send email and room name");
    }    
});
app.get("/validateUserHasBooking", (req, res, next) => {

    let email;
    let room;

    
    if(req.query.hasOwnProperty("email") && req.query.hasOwnProperty("room")){
        
        email = req.query.email;
        room = req.query.room;
        Main.validateUserHasBooking(email,room).then( msg => {res.send(msg);console.log(msg)}).catch( err => res.send(err));
    }else{
        res.send("Please send email and room name");
    }    
});


app.get('/getEmails', (req, res) => {

    Main.getEmployeeEmails().then( employees =>{
        res.json(employees);
    }).catch( err => res.send(err));
});

app.get('/isEmployee', (req, res) => {

    let email = req.query.email;
    
    if(email == undefined || email == "")
        res.send("Please send a valid email");
    else
        Main.isEmployee(email).then( result =>{
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
    res.send(Main.getEmployeeList()); 
});
/** 
 * Function Name:getTitle
 * Version: V1.0
 * Author: Richard McFadden
 * Funtional description: sends back the title of the loggedin person
*/
app.post('/getTitle',(req,res)=>
{
    if(req.body.hasOwnProperty("email") != true)
    {
        res.send("Invalid email");
    }
    else{
        console.log(req.query.email);
        console.log(req.body.email);
        res.send(Main.getTitle(req.body.email));
    }
});
app.post('/generateToken', (req, res) => {
    if( req.body.hasOwnProperty("sender") != true)
    res.send("Invalid sender");
    else
    res.send(Main.generateToken(req.body.sender));
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

    console.log(req.body.eventId);
    if(req.body.eventId != null)
        if(req.body.email != null)
            res.send(Main.generateOTP(req.body.eventId,req.body.email));
        else 
            res.send("Invalid email");
    else
        res.send("Invalid event ID supplied");
    
});



app.post('/validateOTP',(req,res) => {

    
    if(req.query.eventId != null && req.query.eventId != "")
        if(req.query.otp != null && req.query.otp != "")
            Main.validateOTP(req.query.eventId,req.query.otp)
            .then( entryAllowed => res.send(entryAllowed))
            .catch( entryDenied => res.send(entryDenied));
        else 
            res.send("Invalid otp");
    else
        res.send("Invalid event ID supplied");
    
});

  