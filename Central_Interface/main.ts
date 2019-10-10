/** 
 * Filename: main.ts
 * Version: V1.5
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
import { SSL_OP_LEGACY_SERVER_CONNECT } from "constants";
var DatabaseManager = new dbManager();
const CHECK_BOOKINGS_HOURS_AHEAD_OF_TIME = 1;
const MINUTES_BEFORE_EVENT_START_THAT_ENTRANCE_IS_ALLOWED = 15;
const ISSUER  = 'Central Interface';         
//const SUBJECT  = 'admin System';        
const AUDIENCE  = 'A_Recognition';
const MAILSETTING = {
    SENDALL : "SendAll",
    SENDGUEST : "SendGuest",
    SENDNONE : "SendNone"
} 

var currentMailSetting = MAILSETTING.SENDALL;
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
        let currentTime = new Date();
    
        endTime.setHours(endTime.getHours() + CHECK_BOOKINGS_HOURS_AHEAD_OF_TIME);
        
        DatabaseManager.retrieveAllEvents().then(events =>{
            //console.log(events);
            let currentEvents = [];
            let currentTimeString = currentTime.toISOString()
            .substring(currentTime.toISOString().indexOf("T")+1,currentTime.toISOString().length).split(":");

            let currentHours = parseInt(currentTimeString[0]) + 2;//counter for timezone
            let currentMinutes = parseInt(currentTimeString[1]);

            events.events.forEach(event => {
                let eventHours = parseInt(event.endTime.split(":")[0]);
                let eventMinutes = parseInt(event.endTime.split(":")[1]);
                
                if( (eventHours%24) > (currentHours%24)){
                    currentEvents.push(event);
                }else if( eventHours == currentHours){
                    if(eventMinutes > currentMinutes){
                        currentEvents.push(event);
                    }
                }
            });
            
            for (let i = 0; i < currentEvents.length; i++) {
                let event = currentEvents[i];
                let dateNow = currentTime.toISOString().substr(0,currentTime.toISOString().indexOf("T"));
                
                //console.log("into",dateNow,event.startTime);
                
                let entranceAllowedToEvent = new Date(dateNow+ "T"+ event.startTime);

                // console.log("allowed",entranceAllowedToEvent.toISOString());
                // console.log("current",currentTime.toISOString());
                
                entranceAllowedToEvent.setMinutes(entranceAllowedToEvent.getMinutes() - MINUTES_BEFORE_EVENT_START_THAT_ENTRANCE_IS_ALLOWED);

                if(room == event.location){
                    
                    let message = "";

                    if( Utils.inArray(email,Adapter.getEventAttendees(event)))
                    message += "User has a booking in that room";
                    else
                    message += "User does not have a booking for that room";
                    
                    if(currentTime.getTime() > entranceAllowedToEvent.getTime())
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
 * @returns {Promise<boolean>} True if an employee otherwise False
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


 /**
 * Generates the starting token used by the admin system
 * @param {string} subject The email of the admin who is currently using the system requesting the token
 * @returns {string} token
 */

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

/**
 * Returns the subject of a token
 * @param {string} tokenkey The token sent through
 * @returns {Promis<string>} subject
 */
function simpleVerify(tokenkey : string) : Promise<string>{

    let token = tokenkey.substring(6,tokenkey.length  -3);

    let publicKEY  = fs.readFileSync(__dirname + '/public.key', 'utf8');

    var verifyOptions = {
        issuer:  ISSUER,
        audience:  AUDIENCE,
        expiresIn:  "1h",
        algorithm:  ["RS256"]
    };

    return new Promise( (resolve,reject) =>{
        jwt.verify(token, publicKEY, verifyOptions,(err,result)=>{
        
            console.log(result);
            
            if( err != null)    //Invalid token,expired etc
                reject("");
            else
                resolve(result.sub);
        });
    });
    
}

/**
 * Verifies the token passed is valid according to the next token expected
 * @param {string} originalToken The token sent through
 * @returns {Promise<boolean>} resolves true if the token is valid or rejects false otherwise
 */

export function verifyToken(originalToken : string) : Promise<boolean>{

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

/**
 * This generates the secret pad to be used on the currently accepted token
 * @param {string} reference The admin email associated with the token "chain"
 * @param {string} secret The secret associated with the reference
 * @returns {string}  the pad to be appended to the token
 */
function calculateKey(reference : string,secret : string) : string{

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

/**
 * Returns a list of all currently scheduled events
 * @returns {Promise<any>}  An array of events or string stating that there are no events
 */

export function getEventList() : Promise<any>{


    return new Promise( (resolve,reject) =>{
        DatabaseManager.retrieveAllEvents().then( eventsObj =>{
            resolve(eventsObj.events);
        }).catch( err =>{
            reject(err);
        })
    });
    
    
}

/**
 * A force generation of an 'Event level OTP' that can be used by any number of guests
 * @param {number} eventId The event ID of the event the OTP should be generated for
 * @param {boolean} broadcast Whether or not all participants should have an email notification sent 
 * @returns {Promise<boolean>}  True if successful or False for any fault
 */

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
            console.log(result);
            
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

/**
 * Compiles a list of all valid OTP's for an event
 * @param {Object} event The event to search through
 * @returns {Array<string>}  A list of valid OTP's
 */
function compileValidOTPList(event) : Array<string>{
    let validOtp = [];

    if(event.eventOTP != "")
        validOtp.push(event.eventOTP.otp);
    
    event.attendees.forEach(attendee => {
        validOtp.push( attendee.otp.otp);
    });

    return validOtp;
}

/**
 * Checks if the supplied OTP is valid according to room name - used for mobile app
 * @param {string} roomName Name of target room
 * @param {string} otp The otp supplied by user 
 * @returns {Promise<boolean>}  True if OTP is valid or False for any fault
 */

export function validateRoomOTP(roomName : string,otp : string) : Promise<boolean>{

    return new Promise( (resolve,reject) =>{
      DatabaseManager.retrieveAllEvents()
      .then( eventsObj => {
        
        let targetEvent = null;
        //console.log(eventsObj.events,roomName);
        eventsObj.events.forEach(event => {
            
            
            if(event.location == roomName)
            targetEvent = event;
        });
        
        console.log(targetEvent);
        
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
  
  /**
 * Checks if the supplied OTP is valid according to event
 * @param {number} eventId ID of target room
 * @param {string} otp The otp supplied by user 
 * @returns {Promise<boolean>}  True if OTP is valid or False for any fault
 */

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

/**
 * Finds the target event based off any identifier
 * @param {Array<any>} eventsList Array of events
 * @param {string} key The field to search against
 * @param {string} id the value of the target event
 * @returns {any}  The target event or null if not found
 */

function findEvent(array : Array<any>,key : string ,id : string): any{

        for (let index = 0; index < array.length; index++) {

            let item = array[index];
            
            if(item[key] == id){
                return item;
            }
        }
        return null;
}

/**
 * Sends an email to a target recipient
 * @param {string} recipient Email of recipient
 * @param {any} event The event that the recipient is receiving an email for
 * @param {string} otp Optional, if an otp is already created then it gets passed through
 * @returns {void} 
 */

function sendEmail(recipient :string,event:any,otp :string = null){
    
    if(currentMailSetting == MAILSETTING.SENDNONE)
        return;
    
    let newOTP;

    if(currentMailSetting == MAILSETTING.SENDGUEST){
        isEmployee(recipient).then( anEmployee =>{
        
            if( !anEmployee){
                if(otp == null)
                    newOTP =  NotificationSystem.generateOTP();
                else newOTP = otp;

                let notifyViaOTP ={
                    guest : recipient,
                    location : event.location,
                    startDate : event.startDate
                }

                if(event.startTime != null){
                    notifyViaOTP["startTime"] = event.startTime;
                }

                NotificationSystem.sendEmail("otp",notifyViaOTP,newOTP);
            }
                
            
        }).catch(err => console.log(err));
    }else if(currentMailSetting = MAILSETTING.SENDALL){

        if(otp == null)
            newOTP =  NotificationSystem.generateOTP();
        else newOTP = otp;

        let notifyViaOTP ={
            guest : recipient,
            location : event.location,
            startDate : event.startDate
        }

        if(event.startTime != null){
            notifyViaOTP["startTime"] = event.startTime;
        }

        NotificationSystem.sendEmail("otp",notifyViaOTP,newOTP);
    }
                         
}

/**
 * Updates database stored event according to that of booking api
 * @param {any} local Our database version of the event to be updated
 * @param {any} foreign The event supplied by the booking API
 * @returns {boolean}  Whether a change was found
 */

function updateAttendeeList(local,foreign) : boolean{
    let localEmails = local.attendees.map( el => el.email);
    let found = false;
    
    for (let index = 0; index < foreign.attendees.length; index++) {
        let attendee = foreign.attendees[index];

        if(!Utils.inArray(attendee,localEmails)){
            let newOTP =  NotificationSystem.generateOTP();       
            found = true;
            local.attendees.push({
                email : attendee,
                otp : newOTP
            });

                sendEmail(attendee,local,newOTP);
            
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
export function log(msg: string,categoryNow:string,token:string,isToken:boolean)
{
    if(isToken){
        return new Promise( (resolve,reject) =>{
            simpleVerify(token).then(sender =>{
                DatabaseManager.log({ body : { date: new Date(),
                    description: msg,
                    user: sender,
                    category: categoryNow}})
                .then( event => {
                    console.log("Logs stored.",event);
                        resolve(true);
                    }).catch( err => reject(false));
            });
        });
    }else{  //Is not a token 'system call'
        return new Promise( (resolve,reject) =>{
            
                DatabaseManager.log({ body : { date: new Date(),
                    description: msg,
                    user: token,
                    category: categoryNow}})
                .then( event => {
                    console.log("Logs stored.",event);
                        resolve(true);
                    }).catch( err => reject(false));
            });
    }
    
}


/**
 * Changes the email settings
 * @param {string} setting An enum
 * @returns {boolean}  True if the supplied setting was valid otherwise false
 */
export function changeMailSetting(setting : string): boolean{

    if(setting == MAILSETTING.SENDALL || setting == MAILSETTING.SENDGUEST || setting == MAILSETTING.SENDNONE){
        currentMailSetting = setting;
        return true;
    }else{
        return false;
    }
}

/**
 * Synchronizes the database with the information supplied by the booking API
 * @returns {Promise<any>}  Doesnt really
 */

export async function syncEventsToDB() : Promise<any>{

    let theTruth = [];
    let ourTruth = [];
    let toBeDeleted = [];
    let toBeCheckedForUpdates = [];
    let toBeAdded = [];
   
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
                        startDate   : event.startDate,
                        endTime     : event.endTime,
                        attendees : userOtpPair
                    }
                }
                    DatabaseManager.addEvent(request)
                    .then(res =>{
                        console.log(res);
                        userOtpPair.forEach(pair => {
                            //Notify Attendees
                            sendEmail(pair.email,event,pair.otp); 
                        });
                        
                    })
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
            }).catch( err => {      // There were no events found or an error occured

                if(err == "No upcoming events found."){
                    
                    if(DBevents.events.length == 0)
                        console.log("There are no events scheduled");
                    else
                        console.log("Clearing Local DB");
                    
                    DBevents.events.forEach(dbEvent => {
                        DatabaseManager.deleteEvent({body:{eventId :dbEvent.eventId} })
                        .then(res =>console.log(res))
                        .catch(res => console.log(res));
                    });
                    
    
                }else 
                    console.log(err);
                     
            });
    
    }).catch(err => console.log(err));

}

setInterval(()=>{
    syncEventsToDB().then( ()=> console.log("Database synchronized"));
},15000);

