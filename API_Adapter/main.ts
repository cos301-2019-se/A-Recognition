import {Adapter} from "./Adapter";
import * as Utils from "./Utils";

var adapter = new Adapter();

function getAllEvents() : Promise<any>{

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

function getCalendarEvents(calendarId : string = "primary",filter : boolean = false, options : any = null,size : number = 2) : Promise<any>{
    return adapter.retrieveUserEvents(calendarId,filter,options,size);
}

function getCalendars() : Promise<any>{
    return adapter.retrieveUserCalendars();
}

function getEventAttendees(event : any,options : any = null){

    if(options != null)
    return Utils.filter(event.attendees,options);
    else
    return event.attendees;
}

// getAllEvents().then( (bookings)=>{
//     console.log(bookings);
    
//     console.log("Got all events");
    
// });

getCalendars().then( (calendars)=>{
    console.log("**********************************************\n");
    console.log("Retrieving events for calendar : " + calendars[0].calendarTitle);
    console.log("**********************************************\n");

    getCalendarEvents(calendars[0].calendarId,true,{id : true,summary:true,attendees : true}).then( (events)=>{
        //console.log(events);
        console.log( getEventAttendees(events[0],{email:true}));
        
    }).then( ()=>{
        adapter.changeAdaptee();
        getCalendars().then((msg)=>{
            console.log(msg)
            getCalendarEvents().then( (msg)=>{

                console.log(msg)
            
                adapter.changeAdaptee("GooGle")
            });    
        });
        

        
    });
});




