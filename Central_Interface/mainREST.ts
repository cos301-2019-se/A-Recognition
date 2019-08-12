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
let upload = multer({ dest: '../Facial_Recogntion/' })
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

app.get("/getUsersFromDaysEvents", (req, res, next) => {
    Main.getUsersFromDaysEvents().then( users => res.json(users)).catch( err => res.json(err));
});

app.post("/getUsersFromDaysEvents", (req, res) => { 
    Main.getUsersFromDaysEvents().then( users => res.json(users)).catch( err => res.send(err));
});


app.get("/validateUserHasBooking", (req, res, next) => {

    let email;
    let room;

    if(req.query.hasOwnProperty("email") && req.query.hasOwnProperty("room")){
        
        console.log(req.query);
        //if(JSON.parse(req.query.email) != null )
        email = JSON.parse(req.query.email);
        room = JSON.parse(req.query.room);
        //email = req.query.email;
        //room = req.query.room;

        Main.validateUserHasBooking(email,room).then(msg=> {res.send(msg);console.log(msg)}).catch( err => res.send(err));
    }else{
        res.send("Please send email and room name");
    }    
});

app.post("/validateUserHasBooking", (req, res, next) => {

    let email;
    let room;

    console.log(req.query);
    
    if(req.query.hasOwnProperty("email") && req.query.hasOwnProperty("room")){
        
        email = req.query.email;
        room = req.query.room;

        Main.validateUserHasBooking(email,room).then( msg => {res.send(msg);console.log(msg)}).catch( err => res.send(err));
    }else{
        res.send("Please send email and room name");
    }    
});

app.post("/richardsResponse", (req, res, next) => {

    //console.log(req.body);
    let answer = req.body;

    console.log(answer);
    
    res.send(answer);
});

app.get('/getEmails', (req, res) => {

    Main.getEmployeeEmails().then( employees =>{
        res.json(employees);
    }).catch( err => res.send(err));
});

app.get('/isEmployee', (req, res) => {

    let email = req.query.email;
    console.log(email);
    
    if(email == undefined)
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
app.post('/addEmployee',upload.single('image'), async(req, res) => {

    // doTheThingWithTheObject();
    // passItToRichard();
    await delay(6000);
    res.json(Main.addEmplpoyee(req)); 
});

app.get('/generateToken', (req, res) => {
    res.json(Main.generateToken());
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

    if(req.query.eventId != null)
        if(req.query.email != null)
            res.send(Main.generateOTP(req.query.eventId,req.query.email));
        else 
            res.send("Invalid email");
    else
        res.send("Invalid event ID supplied");
    
});
  