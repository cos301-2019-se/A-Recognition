import {Adapter} from "./Adapter";
import * as Utils from "../Utils/Utils";

var adapter = new Adapter();

export function getAllEvents() : Promise<any>{

    return adapter.retrieveUserCalendars().then( (calendarList)=>{

        let eventBookings = [];
    
        calendarList.forEach(calendar => {
            eventBookings.push( adapter.retrieveUserEvents(calendar.calendarId,true,null,2) );
        });
        return Promise.all(eventBookings);
        
    }).catch( (err)=>{
        console.log(err);
    });
}

export function getCalendarEvents(calendarId : string = "primary",filter : boolean = false, options : any = null,size : number = 4) : Promise<any>{
    return adapter.retrieveUserEvents(calendarId,filter,options,size);
}

export function getCalendars() : Promise<any>{
    return adapter.retrieveUserCalendars();
}

export function getEventAttendees(event : any,options : any = null){

    if(options != null)
    return Utils.filter(event.attendees,options);
    else
    return event.attendees;
}

export function changeAdaptee(target = null){
    adapter.changeAdaptee(target);
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

export  function getEvents(calendarId : string = "primary",filter : boolean = false, options : any = null,size : number = 4) : Promise<any>{
    let currentEvents = [];

    return getCalendarEvents(calendarId,filter, options,size).then( events =>{
        events.forEach(event => {
            currentEvents.push(event);
        });

        return currentEvents;
    }).catch( err => {
    
        return err
    });

  
}




