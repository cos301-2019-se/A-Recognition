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
import { resolve } from "dns";
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
    
        // return new Promise( (resolve,reject)=>{
        //     Adapter.getEvents().then( events =>{
    
        //         let attendeesBookedToday = [];
        
        //         if(Array.isArray(events)){
        //             events.forEach(event => {
        //                 event["attendees"].forEach( person => {
        //                     if( !Utils.inArray(person.email,attendeesBookedToday))
        //                     attendeesBookedToday.push(person.email);
        //                 });
        //             });
        //         }else{
        
        //             events["attendees"].forEach( person => {
        //                 if( !Utils.inArray(person.email,attendeesBookedToday))
        //                 attendeesBookedToday.push(person.email);
        //             });
        //         }
               
        //         resolve(attendeesBookedToday);
        //     }).catch( (err)=>{
        //         reject(null);
        //     })
            
        // } );
    
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
            
//    return new Promise( (resolve,reject) =>{

//         let endTime = new Date();
//         endTime.setHours(endTime.getHours() + CHECK_BOOKINGS_HOURS_AHEAD_OF_TIME);
        
        
//         Adapter.getEvents("primary",true,{attendees : true,location : true,start : true},3,endTime.toISOString()).then( (closestEvents)=>{
            
            
//             for (let i = 0; i < closestEvents.length; i++) {
//                 let event = closestEvents[i];

//                 let timeNow = new Date();
//                 let entranceAllowedToEvent = new Date(event.startDate + "T"+ event.startTime);
//                 entranceAllowedToEvent.setMinutes(entranceAllowedToEvent.getMinutes() - MINUTES_BEFORE_EVENT_START_THAT_ENTRANCE_IS_ALLOWED);

//                 if(room == event.location){
                    
                    
//                     let message = "";

//                     if( Utils.inArray(email,event.attendees))
//                     message += "User has a booking in that room";
//                     else
//                     message += "User does not have a booking for that room";

//                     if(timeNow.getTime() > entranceAllowedToEvent.getTime())
//                     message += ",Room allows access now";
//                     else
//                     message += ",Room does not allow access yet";
                    
//                     resolve(message);
                    
//                 }
                
//             }
//             resolve("There is no booking for that room now");
            
//         }).catch( err =>{
//             reject(err);
//         });
//    }); 
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

 /**
 * Polls events and checks if a user assinged to an event is a guest, sending them an OTP
 * @returns {void}
 */
export function checkBookingsForGuests(){ //TODO : MAke it work for the same user across multiple events

    let markedAsGuest = [];

    setInterval( ()=>{
        getEmployeeEmails().then( emails =>{

            Adapter.getEvents("primary",true,{location:true,start:true,attendees:true}).then( events =>{
                events.forEach(event => {
                    event.attendees.forEach(attendee => {
                        if(!Utils.inArray(attendee,markedAsGuest) && !Utils.inArray(attendee,emails)){
                            markedAsGuest.push(attendee);
                            
                            //console.log(event);
                            
                            let notifyViaOTP ={
                                guest : attendee,
                                location : event.location,
                                startDate : event.startDate
                            }

                            if(event.startTime != null){
                                notifyViaOTP["startTime"] = event.startTime;
                            }
                        
                            NotificationSystem.sendEmail("otp",notifyViaOTP);
                            
                        }
                    });
                });
                
            }).catch(err =>{
                console.log(err);
            })
    
        }).catch(err =>{
            console.log(err);
        })
    },15000);
    
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
            //console.log(user.employees);
            resolve(user.employees);
        });
    });
   
}

export function getEventList() : Promise<any>{

    return new Promise( (resolve,reject)=>{
        Adapter.getEvents("primary",true,{id:true,summary:true,location:true,start:true,end:true}).then( events =>{
            resolve(events);
        }).catch(err => reject(err));
    });
    
}
//getEmployeeList();

export function generateOTP(eventId : number,email : string,broadcast: boolean) : Promise<boolean>{

    return new Promise( (resolve,reject) =>{
        let otp = NotificationSystem.generateOTP();
  
    DatabaseManager.retrieveEvent({ body : {eventId : eventId}})
    .then( event => {
        event.eventId = eventId;
        event.eventOTP = otp;
        
        DatabaseManager.updateEvent({ body : event}).then( result =>{
            console.log(result);

            if(broadcast == true)
            {   
                result["attendees"].forEach(attendee => {
                    let notifyViaOTP ={
                        guest : attendee,
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
    
    event.attendeeOTPpairs.forEach(attendee => {
        validOtp.push( attendee.otp.otp);
    });

    return validOtp;
}
export function validateOTPByRoom(roomID: any, otp:string): Promise<boolean>
{
    return new Promise( (resolve,reject) => {
        //Need to implement this 
    });
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
     .catch( err => reject(err.message));
  })
    

}
async function clearOutdatedEvents() : Promise<any>{
    //getAllEvents
    let promises = [];
            await DatabaseManager.retrieveEventIds().then( async eventIdList =>{

                await eventIdList.eventIds.forEach(async eventId => {
                    
                    promises.push(DatabaseManager.deleteEvent({body:{eventId : eventId}}))
                    
                });
                return Promise.all(promises);

            }).catch( err => console.log(err));

}
export async function syncEventsToDB() : Promise<any>{

    await clearOutdatedEvents();
    let promises = [];

        
        Adapter.getEvents("primary",true,
        {id:true,summary:true,location:true,start:true,end:true,attendees: true})
        
        .then( events =>{
            
            events.forEach( event => {

                let attendees = event.attendees;
                let otpList = [];
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
                        attendeeOTPpairs : userOtpPair
                    }
                }
                
                
                promises.push(
                     DatabaseManager.addEvent(request)   //Event already exists, no action
                );
                
            });
            
        }).catch( err =>{
                console.log(err);  
        })    

        return Promise.all(promises);
}

syncEventsToDB().then( ()=> console.log("Database synchronized"));

//checkBookingsForGuests();
