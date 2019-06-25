import {Adapter} from "./Adapter";

let adapter = new Adapter();

adapter.retrieveUserCalendars().then( (calendarList)=>{

    console.log(calendarList);

    calendarList.forEach(calendar => {
        adapter.retrieveUserEvents(calendar.calendarId,true,null,2)
        .then( (bookings)=>console.log(bookings))
        .catch( ()=>{});
    });
    
    
}).catch( (err)=>{
    console.log(err);
})

