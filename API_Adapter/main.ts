/** 
 * Filename: main.ts
 * Version: V1.0
 * Author: JJ Goschen
 * Project name: A-Recognition (Advance)
 * Organization: Singularity
 * Funtional description: Provides a wrapper around the adpater for event functionality
*/
import {Adapter} from "./Adapter";
import * as Utils from "../Utils/Utils";

var adapter = new Adapter();

 /**
 * Should not be used in current state
 * @returns {Promise<any>}
 */
export function getAllEvents() : Promise<any>{

    return adapter.retrieveUserCalendars().then( (calendarList)=>{

        let eventBookings = [];
    
        calendarList.forEach(calendar => {
            eventBookings.push( adapter.retrieveUserEvents(calendar.calendarId,true,null,2,"") );
        });
        return Promise.all(eventBookings);
        
    }).catch( (err)=>{
        console.log(err);
    });
}

 /**
 * Returns a list of events for a specific calendarId
 * @param {string} calendarId The calendar identifier, typically 'primary'
 * @param {boolean} filter Indicates whether you want the events to be filtered
 * @param {Object} options What keys are to be returned after filtering, eg {foo : true}
 * @param {number} size How many events to return, -1 will return maximum
 * @param {string} endTime ISO string of the time after which no more events should be collected
 * @returns {Promise<any>}
 */
export function getCalendarEvents(calendarId : string = "primary",filter : boolean = false, options : any = null,size : number = 4,endTime : string = "") : Promise<any>{
    return adapter.retrieveUserEvents(calendarId,filter,options,size,endTime);
}

 /**
 * Returns a list of calendars associated with the current user credentials
 * @returns {Promise<any>}
 */
export function getCalendars() : Promise<any>{
    return adapter.retrieveUserCalendars();
}
 /**
 * Returns an array of event attendees given an event object
 * @param {any} event The event to pull from
 * @param {any} options The filter that should be applied to the attendees
 * @returns {Promise<any>}
 */
export function getEventAttendees(event : any,options : any = null) : Array<Object | string> | Object{
    
    if(options != null)
    return Utils.filter(event.attendees,options);
    else
    return event.attendees;
}
 /**
 * Changes the current target API
 * @param {string} target The target adaptee eg. google,microsoft
 * @returns {string}
 */
export function changeAdaptee(target : string = null ) : string{
    return adapter.changeAdaptee(target);
}

export function run(){

    let currentEvents = [];
    
    setInterval( ()=>{
        getCalendarEvents().then( (events)=>{

            events.forEach(event => {

                if( !Utils.inArray(event.id,currentEvents,"id") )  
                    currentEvents.push( Utils.filter(event,{id : true,summary:true,location:true,description:true}) );
                else 
                console.log( currentEvents.indexOf(event));
                
                
            });
            console.log("Current events:\n",currentEvents);
        }).catch((err)=>{
            console.log(err);  
        })

    },10000)
}

 /**
 * Returns a list of events for a specific calendarId
 * @param {string} calendarId The calendar identifier, typically 'primary'
 * @param {boolean} filter Indicates whether you want the events to be filtered
 * @param {Object} options What keys are to be returned after filtering, eg {foo : true}
 * @param {number} size How many events to return, -1 will return maximum
 * @param {string} endTime ISO string of the time after which no more events should be collected
 * @returns {Promise<any>}
 */
export  function getEvents(calendarId : string = "primary",filter : boolean = false, options : any = null,size : number = 4,endTime : string = "") : Promise<any>{
    let currentEvents = [];

    return new Promise( (resolve,reject) =>{
        getCalendarEvents(calendarId,filter, options,size,endTime).then( events =>{
            events.forEach(event => {
                currentEvents.push(event);
            });
    
            resolve(currentEvents);
        }).catch( err => {
        
            reject(err);
        });
        
    });
}




