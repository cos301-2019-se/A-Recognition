/** 
 * Filename: main.ts
 * Version: V1.3
 * Author: JJ Goschen
 * Project name: A-Recognition (Advance)
 * Organization: Singularity
 * Funtional description: Provides an interface used to integrate capabilities of other components
*/
import * as Adapter from "../API_Adapter/main";
import * as Utils from "../Utils/Utils";
import {PythonShell} from 'python-shell'; //npm install python-shell
import * as NotificationSystem from "../Database_Manager/notification";
import dbManager from "../Database_Manager/databaseManager"
import * as jwt from "jsonwebtoken"; //npm install jsonwebtoken
import * as fs from "fs";
import * as crypto from 'crypto';
import { setInterval } from "timers";
var DatabaseManager = new dbManager();
const CHECK_BOOKINGS_HOURS_AHEAD_OF_TIME = 1;
const MINUTES_BEFORE_EVENT_START_THAT_ENTRANCE_IS_ALLOWED = 15;
const ISSUER  = 'Central Interface';         
//const SUBJECT  = 'admin System';        
const AUDIENCE  = 'A_Recognition'; 
/**
 * Returns a list of user emails for all users that have bookings on the current day
 * @returns {Promise<Array<string> | null>} an array of emails if there are events for the current day or a null object if there is none or an error occured.
 */
export function getUsersFromDaysEvents() :Promise<Array<string> | null>{

    
        return new Promise( (resolve,reject)=>{
            let daysAttendees = [];

            DatabaseManager.retrieveAllEvents().then( eventsObj =>{
    
                eventsObj.events.forEach(event => {

                    Adapter.getEventAttendees(event).forEach(attendee => {
                        
                        if( !Utils.inArray(attendee,daysAttendees))
                            daysAttendees.push(attendee);
                    });
                 
                });
                resolve(daysAttendees);
                
            }).catch( err => reject(err));
        });
    
        
}

 /**
 * Validates that the given email at the given room has a booking at the current time
 * @param {string} email The array or single object to filter
 * @param {string} room Specifies what keys should be passed on to the new object
 * @returns {Promise<any>}
 */
export function validateUserHasBooking(email : string,room : string) : Promise<any>{

    return new Promise( (resolve,reject) =>{

        let endTime = new Date();
        endTime.setHours(endTime.getHours() + CHECK_BOOKINGS_HOURS_AHEAD_OF_TIME);
        
        DatabaseManager.retrieveAllEvents().then(events =>{
            //console.log(events);
            let currentEvents = [];
            let currentTime = new Date().toISOString();
            let time = currentTime.substring(currentTime.indexOf("T")+1,currentTime.length).split(":");
            let hours = parseInt(time[0]) + 2;//counter for timezone
            let minutes = parseInt(time[1]);
            
            events.events.forEach(event => {
                let eventHours = parseInt(event.endTime.split(":")[0]);
                let eventMinutes = parseInt(event.endTime.split(":")[1]);
            
                
                if(eventHours > hours){
                    currentEvents.push(event);
                }else if( eventHours == hours){
                    if(eventMinutes > minutes){
                        currentEvents.push(event);
                    }
                }
            });
            
            for (let i = 0; i < currentEvents.length; i++) {
                let event = currentEvents[i];

                let timeNow = new Date();
                let dateNow = timeNow.toISOString();
                dateNow = dateNow.substr(0,dateNow.indexOf("T"));
                
                let entranceAllowedToEvent = new Date(dateNow+ "T"+ event.startTime);

                entranceAllowedToEvent.setMinutes(entranceAllowedToEvent.getMinutes() - MINUTES_BEFORE_EVENT_START_THAT_ENTRANCE_IS_ALLOWED);

                if(room == event.location){
                    
                    let message = "";

                    if( Utils.inArray(email,Adapter.getEventAttendees(event)))
                    message += "User has a booking in that room";
                    else
                    message += "User does not have a booking for that room";

                    if(timeNow.getTime() > entranceAllowedToEvent.getTime())
                    message += ",Room allows access now";
                    else
                    message += ",Room does not allow access yet";
                    
                    resolve(message);
                    
                }
                
            }
            resolve("There is no booking for that room now");
            
        }).catch( err =>{
            reject(err);
        });

            
        });
            

}

 /**
 * Fetches the email addresses of current employees
 * @returns {Promise<any>}
 */
export function getEmployeeEmails() : Promise<any>{

    return new Promise( (resolve,reject) =>{
        let emails = [];

        DatabaseManager.retrieveAllUsers()
        .then(usersObj =>{
            usersObj.employees.forEach(user => {
                emails.push(user.email);
            });
            resolve(emails);
        })
        .catch(err =>console.log(err));
    });
}

 /**
 * Validates if the provided email belongs to a registered employee
 * @param {string} email The array or single object to filter
 * @returns {Promise<boolean>}
 */
export function isEmployee(email : string) : Promise<boolean>{
    
    return new Promise( (resolve,reject)=>{
        getEmployeeEmails().then( employees =>{
            //console.log(JSON.parse(employees));
            resolve(Utils.inArray(email,employees)) ;
        }).catch( (err)=>{
            console.log(err);
            
            reject(false);
        });
    });
}

var tokenBook = {};

export function generateToken(subject : string) : string{
    let privateKEY  = fs.readFileSync(__dirname + '/private.key', 'utf8');
    

    let payload = {
        item : true,
    }

    
    let signOptions = {
    issuer:  ISSUER,
    subject:  subject,
    audience:  AUDIENCE,
    expiresIn:  "1h",
    algorithm:  "RS256"
    };

    let token = jwt.sign(payload, privateKEY, signOptions);
  
    console.log(token);
    //the secret sauce
    tokenBook[subject] = 1;
    
    return token;
    
}


export function verifyToken(originalToken : string){

    let publicKEY  = fs.readFileSync(__dirname + '/public.key', 'utf8');

    var verifyOptions = {
        issuer:  ISSUER,
        audience:  AUDIENCE,
        expiresIn:  "1h",
        algorithm:  ["RS256"]
    };

    let secretKey = originalToken.substring(originalToken.length - 6,originalToken.length);
    let token = originalToken.substring(0,originalToken.length - 6);
    
    return new Promise( (resolve,reject) =>{
        jwt.verify(token, publicKEY, verifyOptions,(err,result)=>{
        
        if( err != null)    //Invalid token,expired etc
            reject(false);
        
        let userEmail = result.sub;
        DatabaseManager.retrieveUser({body: {email : userEmail}}).then( user =>{
            let secret = user.title;
            
            let calculatedSecretKey = calculateKey(userEmail,secret);

            console.log("Calculated:",calculatedSecretKey,"\nReceived:",secretKey);

            if(calculatedSecretKey == null){
                console.log("The token was never issued in the first place");
                reject(false);
            }else if(calculatedSecretKey == secretKey){
                tokenBook[userEmail] += 1;
                resolve(true);
            }else 
                reject(false);
                
        }).catch( err => {
            reject(false);
            
        })        
    });
});
    
}

//secret sauce for the tokens
function calculateKey(reference,secret) : string{

    if(tokenBook[reference] == undefined)
    return null;

    let count = tokenBook[reference];
    let string = "";

    
    
    for (let index = 0; index < count; index++) {
        string += secret;
    }
    
    var hash = crypto.createHash('sha256')
   .update(string)
   .digest('hex');

   let shortHash = hash[0] + hash[7] + hash[23] + hash[39] + hash[46] + hash[55];
   return shortHash;
}
/** 
 * Function Name:addEmployee
 * Version: V2.7
 * Author: Richard McFadden
 * Funtional description: makes the request to the python file
 * to add the new employee to the database
*/
export function addEmplpoyee(req : any)
{   
    // console.log("Name",req.body.name );
    // console.log("Surname", req.body.surname);
    // console.log("Email",req.body.email);
    // console.log("image",req.file['filename']);

    let nameOfFile =req.file['filename'];
    console.log(nameOfFile)
   
    let options = {
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: './Facial_Recogntion/',
        args: [nameOfFile ,req.body.name, req.body.surname ,req.body.title, req.body.email ]
      };

      let shell = new PythonShell('encodingBackup.py',options);
      shell.on('message',(message)=>
      {
          console.log(message);
      });

      shell.end(function (err,code,signal) 
      {
        if(err)
        {
            throw err;
        }
        console.log('The exit code was: ' + code);
        console.log('The exit signal was: ' + signal);

        return true;
      });
      return true;
}
/** 
 * Function Name:getTitle
 * Version: V1.0
 * Author: Richard McFadden
 * Funtional description: sends back the title of the loggedin person
*/
export function getTitle(req : any)
{
    DatabaseManager.retrieveUser({body: {email : req}}).then( user =>{
       return user.title;
    });
}
/** 
 * Function Name:getEmployeeList
 * Version: V1.0
 * Author: Richard McFadden
 * Funtional description: list of employees
*/
export function getEmployeeList()
{
    return new Promise( (resolve,reject) => {
        DatabaseManager.retrieveAllUsers().then( (user) =>
        {
            resolve(user.employees);
        });
    });
   
}

export function getEventList() : Promise<any>{

    // return new Promise( (resolve,reject)=>{
    //     Adapter.getEvents("primary",true,{id:true,summary:true,location:true,start:true,end:true}).then( events =>{
    //         resolve(events);
    //     }).catch(err => reject(err));
    // });

    return new Promise( (resolve,reject) =>{
        DatabaseManager.retrieveAllEvents().then( eventsObj =>{
            resolve(eventsObj.events);
        }).catch( err =>{
            reject(err);
        })
    });
    
    
}
//getEmployeeList();

export function generateOTP(eventId : number, broadcast: boolean) : Promise<boolean>{

    return new Promise( (resolve,reject) =>{
        let otp = NotificationSystem.generateOTP();
        
    DatabaseManager.retrieveEvent({ body : {eventId : eventId}})
    .then( event => {
        event.eventId = eventId;
        event.eventOTP = otp;
        
        DatabaseManager.updateEvent({ body : event}).then( result =>{

            if(broadcast == true)
            {   
                event["attendees"].forEach(attendee => {
                    let notifyViaOTP ={
                        guest : attendee.email,
                        location : event.location,
                        startDate : event.startDate
                    }

                    if(event.startTime != null){
                        notifyViaOTP["startTime"] = event.startTime;
                    }
                
                    NotificationSystem.sendEmail("otp",notifyViaOTP, otp);
                });
                              
            }
            resolve(true);
            
        }).catch( err => {
            console.log(err.message);
            reject(false)
        });
     })
     .catch( err => {
        console.log(err.message);
        reject(false)
    });
});
    

}

function compileValidOTPList(event) : Array<string>{
    let validOtp = [];

    if(event.eventOTP != "")
        validOtp.push(event.eventOTP.otp);
    
    event.attendees.forEach(attendee => {
        validOtp.push( attendee.otp.otp);
    });

    return validOtp;
}
export function validateRoomOTP(roomName : string,otp : string) : Promise<boolean>{

    return new Promise( (resolve,reject) =>{
      DatabaseManager.retrieveAllEvents()
      .then( eventsObj => {
        
        let targetEvent = null;
        
        eventsObj.events.forEach(event => {
            if(event.location == roomName)
            targetEvent = event;
        });
        
        if(targetEvent == null)
        reject(false);

          let otpList = compileValidOTPList(targetEvent);        
          if( Utils.inArray(otp,otpList))
              resolve(true);
          else 
              reject(false);
       })
       .catch( err => reject(err.message));
    })
  }
  
export function validateOTP(eventId : number,otp : string) : Promise<boolean>{

  return new Promise( (resolve,reject) =>{
    DatabaseManager.retrieveEvent({ body : {eventId : eventId}})
    .then( event => {
        
        let otpList = compileValidOTPList(event);        
        if( Utils.inArray(otp,otpList))
            resolve(true);
        else 
            reject(false);
     })
     .catch( err => reject(false));
  })
}

function findEvent(array : Array<any>,key : string ,id : string): any{

        for (let index = 0; index < array.length; index++) {

            let item = array[index];
            
            if(item[key] == id){
                return item;
            }
        }
        return null;
}

function updateAttendeeList(local,foreign){
    let localEmails = local.attendees.map( el => el.email);
    let found = false;
    
    for (let index = 0; index < foreign.attendees.length; index++) {
        let attendee = foreign.attendees[index];

        if(!Utils.inArray(attendee,localEmails)){        
            found = true;
            local.attendees.push({
                email : attendee,
                otp : NotificationSystem.generateOTP()
            });

            isEmployee(attendee).then( anEmployee =>{
                
                if( !anEmployee){

                    let notifyViaOTP ={
                        guest : attendee,
                        location : local.location,
                        startDate : local.startDate
                    }

                    if(local.startTime != null){
                        notifyViaOTP["startTime"] = local.startTime;
                    }
                
                    NotificationSystem.sendEmail("otp",notifyViaOTP);
                }
            }).catch(err => console.log(err));            
            
        }   
    }

    for (let index = 0; index < localEmails.length; index++) {
        let attendee = localEmails[index];

        if(!Utils.inArray(attendee,foreign.attendees)){        
            found = true;
            local.attendees.splice(index, 1); 
        }   
    }
    return !found;
}

export async function syncEventsToDB() : Promise<any>{

    let theTruth = [];
    let ourTruth = [];
    let toBeDeleted = [];
    let toBeCheckedForUpdates = [];
    let toBeAdded = [];
    //await clearOutdatedEvents();
    DatabaseManager.retrieveAllEvents().then(DBevents =>{
        Adapter.getEvents("primary",true,
        {id:true,summary:true,location:true,start:true,end:true,attendees: true})
        
        .then( events =>{
            DBevents.events.forEach(dbEvent => {
                ourTruth.push(dbEvent.eventId);
            });

            events.forEach(event => {
                theTruth.push(event.id);
            });

            ourTruth.forEach(ourEvent => {
                if(!Utils.inArray(ourEvent,theTruth))   //Our event is no longer happening or otherwise doesnt exist
                    toBeDeleted.push(ourEvent);             //so it must be removed
                else //we also have the event, check for updates
                    toBeCheckedForUpdates.push(ourEvent);
            });

            theTruth.forEach( truthEvent =>{
                if(!Utils.inArray(truthEvent,toBeCheckedForUpdates))    //This event isnt in our database
                toBeAdded.push(truthEvent);
            });

            //Now know what needs to be deleted,updated and added.Lets get to work
            
            toBeDeleted.forEach( deleteId =>{
                DatabaseManager.deleteEvent({body:{eventId :deleteId} })
                .then(res =>console.log(res))
                .catch(res => console.log(res));
            });

            toBeAdded.forEach( addId =>{
                let event = findEvent(events,"id",addId);
        
                let attendees = event.attendees;
                let userOtpPair = [];
                
                attendees.forEach(attendee => {
                    userOtpPair.push( {
                        email : attendee,
                        otp : NotificationSystem.generateOTP()
                    });
                });

                let request = {
                    body : {
                        eventId     : event.id,
                        summary     : event.summary,
                        location    : event.location,
                        startTime   : event.startTime,
                        endTime     : event.endTime,
                        attendees : userOtpPair
                    }
                }
                    DatabaseManager.addEvent(request)
                    .then(res =>console.log(res))
                    .catch( res => console.log(res) );
                    
                });

                toBeCheckedForUpdates.forEach( updateId =>{
                    let event = findEvent(DBevents.events,"eventId",updateId);
                    let newEvent = findEvent(events,"id",updateId);
                    let change = false;

                    if(event.summary != newEvent.summary){
                        change = true;
                        event.summary = newEvent.summary;
                    }
                        
                    
                    if(event.location != newEvent.location){
                        change = true;
                        event.location = newEvent.location;
                    }

                    if(event.startTime != newEvent.startTime){
                        change = true;
                        event.startTime = newEvent.startTime;
                    }

                    if(event.endTime != newEvent.endTime){
                        change = true;
                        event.endTime = newEvent.endTime;
                    }
                    
                    if( !updateAttendeeList(event,newEvent)){
                        change = true;
                    }

                    if( change){    //Only update if there is a difference
                        let request = {
                            body : {
                                eventId     : event.eventId,
                                summary     : event.summary,
                                location    : event.location,
                                startTime   : event.startTime,
                                endTime     : event.endTime,
                                attendees : event.attendees
                            }
                        }
                        DatabaseManager.updateEvent(request)
                        .then(res =>console.log(res))
                        .catch(res => console.log(res));
                        change = false;
                     }
     
                });
            });
    
    });

}

setInterval(()=>{
    syncEventsToDB().then( ()=> console.log("Database synchronized"));
},1500000);

