import * as Main from "./main";

// getAllEvents().then( (bookings)=>{
//     console.log(bookings);
    
//     console.log("Got all events");
    
// });

if(process.argv.length != 0 && process.argv[2].toLowerCase() == "standard"){
    Main.getCalendars().then( (calendars)=>{
        console.log("**********************************************");
        console.log("Retrieving events for calendar : " + calendars[0].calendarTitle);
        console.log("**********************************************\n");
    
        Main.getCalendarEvents(calendars[0].calendarId,true,{id : true,summary:true,attendees : true}).then( (events)=>{
            //console.log(events);
            console.log( Main.getEventAttendees(events[0],{email:true}));
            
        }).catch( (err)=>{
            console.log(err);
            
        }).then( ()=>{
            Main.changeAdaptee();
            Main.getCalendars().then((msg)=>{
                console.log(msg)
                Main.getCalendarEvents().then( (msg)=>{
    
                    console.log(msg);
                
                    Main.changeAdaptee("GooGle");
                });    
            });
            
        });
    });
}else if(process.argv[2].toLowerCase() == "run"){
    Main.run();
}else if(process.argv[2].toLowerCase() == "get"){
   Main.getEvents("primary",true,{id : true,summary:true,location:true,description:true,attendees:true},-1).then( (something) =>{
       console.log(something);
   });
}
