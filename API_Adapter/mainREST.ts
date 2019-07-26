//npm install express --save
import * as Main from "./main";

var express = require("express");
var app = express();

app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.get("/getEvents", (req, res, next) => {
    
   let filterObject = {};

   if (Object.keys(req.query).length === 0 ){   //No Filter
      filterObject["id"] = true;
      filterObject["summary"] = true;
      filterObject["location"] = true;
      filterObject["description"] = true;
      filterObject["attendees"] = true;
   }else{   //Filter

      for (const prop in req.query) {
         if (req.query.hasOwnProperty(prop)) {
            filterObject[prop] = true;
         }
      }
   }
   
   Main.getEvents("primary",true,filterObject,-1).then( events =>{
  
   res.json(events);
   
   }).catch( err =>{
      res.json(err);
   }); 
});
  

app.get("/changeAdaptee", (req, res, next) => {
   let target;

   if (Object.keys(req.query).length === 0 || !req.query.hasOwnProperty("target") ) //No target specified
      target = Main.changeAdaptee();
   else 
      target = Main.changeAdaptee(req.query.target);

   res.send(target);
});


app.get("/getCalendars", (req, res, next) => {

   Main.getCalendars().then( calendars =>{
      res.json(calendars);
   }).catch( err =>{
      res.send(err);
   });

});

app.get("/getEventAttendees", (req, res, next) => {

   let event = JSON.parse(req.query.event);
   let attendees = Main.getEventAttendees(event);
   
   res.json(attendees);

});
