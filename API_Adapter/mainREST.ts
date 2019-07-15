//npm install express --save
import * as Main from "./main";

var express = require("express");
var app = express();

app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.get("/getEvents", (req, res, next) => {
    
   Main.getEvents("primary",true,{id : true,summary:true,location:true,description:true,attendees:true},-1).then( events =>{
  
   res.json(events);
   });
});
  