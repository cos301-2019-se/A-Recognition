import * as Main from "./main";

//npm i @types/node

if(process.argv.length > 2){
    if(process.argv[2].toLowerCase() == "standard"){
        Main.getCalendars().then( (calendars)=>{
            console.log("**********************************************");
            console.log("Retrieving events for calendar : " + calendars[0].calendarTitle);
            console.log("**********************************************\n");
        
            Main.getCalendarEvents(calendars[0].calendarId,true,{id : true,summary:true,attendees : true}).then( (events)=>{
                //console.log(events);
                console.log( Main.getEventAttendees(events[0]));
                
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
} 

function test_getEventAttendees(){
    
    let event = {
        eventName : "test event",
        startTime : 100
    }

        event["attendees"] =  [ {email : "testtesttest@email.com"}, {email : "test3@gmail.com"}];

        try{
            let attendees = Main.getEventAttendees(event);
            if(attendees[0] === "testtesttest@email.com"&&  attendees[1] === "test3@gmail.com")
            console.log("Test 1 Passed :)");
            else 
            console.log("Test 1 Failed x",attendees);
            
            event["attendees"] = [];

            attendees = Main.getEventAttendees(event);
            if(attendees.length == 0)
            console.log("Test 2 Passed :)");
            else 
            console.log("Test 2 Failed x");

        }catch( err){
            console.log("Test failed :"+ err);   
        }     
}
