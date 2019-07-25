/** 
 * Filename: main.ts
 * Version: V1.0
 * Author: JJ Goschen
 * Project name: A-Recognition (Advance)
 * Organization: Singularity
 * Funtional description: Provides an interface used to integrate capabilities of other components
*/
import * as Adapter from "../API_Adapter/main";
import * as Utils from "../Utils/Utils";
import {PythonShell} from 'python-shell'; //npm install python-shell
import * as NotificationSystem from "../notification";

const CHECK_BOOKINGS_HOURS_AHEAD_OF_TIME = 1;
const MINUTES_BEFORE_EVENT_START_THAT_ENTRANCE_IS_ALLOWED = 15;
/**
 * Returns a list of user emails for all users that have bookings on the current day
 * @returns {Promise<Array<string> | null>} an array of emails if there are events for the current day or a null object if there is none or an error occured.
 */
export function getUsersFromDaysEvents() :Promise<Array<string> | null>{

    return new Promise( (resolve,reject)=>{

        Adapter.getEvents().then( events =>{

            let attendeesBookedToday = [];
    
            if(Array.isArray(events)){
                events.forEach(event => {
                    event["attendees"].forEach( person => {
                        if( !Utils.inArray(person.email,attendeesBookedToday))
                        attendeesBookedToday.push(person.email);
                    });
                });
            }else{
    
                events["attendees"].forEach( person => {
                    if( !Utils.inArray(person.email,attendeesBookedToday))
                    attendeesBookedToday.push(person.email);
                });
            }
           
            resolve(attendeesBookedToday);
        }).catch( (err)=>{
            reject(null);
        })
        
    } );
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
        
        
        Adapter.getEvents("primary",true,{attendees : true,location : true,start : true},3,endTime.toISOString()).then( (closestEvents)=>{
            
            
            for (let i = 0; i < closestEvents.length; i++) {
                let event = closestEvents[i];

                let timeNow = new Date();
                let entranceAllowedToEvent = new Date(event.start.dateTime);
                entranceAllowedToEvent.setMinutes(entranceAllowedToEvent.getMinutes() - MINUTES_BEFORE_EVENT_START_THAT_ENTRANCE_IS_ALLOWED);
                
                if(room == event.location){
                    
                    
                    let message = "";

                    if( Utils.inArray(email,event.attendees))
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
        var pyshell = new PythonShell("test.py");

        pyshell.on('message', function (message) {
            // received a message sent from the Python script (a simple "print" statement)
            //Why does python return a string instead of an array
            let array = message.split(",");
            array = array.map( el => el.replace(/'|,/g,""));
            array = array.map( el => el.replace("[",""));
            array = array.map( el => el.replace("]",""));
            array = array.map( el => el.trim());
            resolve(array);

            //DATA CONTAINS THE EMAILS
        });
        
        // end the input stream and allow the process to exit
        pyshell.end(function (err) {
            if (err){
                reject(err);
            };
  
        });
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
                            
                            let notifyViaOTP ={
                                guest : attendee,
                                location : event.location,
                                startDate : event.start.dateTime.substring(0,event.start.dateTime.indexOf("T")),
                                startTime : event.start.dateTime.substring(event.start.dateTime.indexOf("T") + 1,event.start.dateTime.length)
                            }
                            console.log("Sending OTP",notifyViaOTP);
                            NotificationSystem.sendEmail("otp",notifyViaOTP,NotificationSystem.generateOTP().otp);
                            
                            
                        }
                    });
                });
                
            }).catch(err =>{
                console.log(err);
            })
    
        }).catch(err =>{
            console.log(err);
        })
    },5000);
    
}

checkBookingsForGuests();