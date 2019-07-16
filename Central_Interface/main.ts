import * as Adapter from "../API_Adapter/main";
import * as Utils from "../Utils/Utils";

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

// getUsersFromDaysEvents().then( users =>{
//     console.log(users); 
// });

validateUserHasBooking("jarrodgoschen1@gmail.com","Room 7").then( (msg)=>{
    console.log(msg);

    validateUserHasBooking("jarrodgoschen@gmail.com","Room 7").then( (msg)=>{
        console.log(msg);
    
        validateUserHasBooking("mcfaddenr.ebb@gmail.com","Room 99 @ Khaosan, 99 Samsen 4 Alley, Khwaeng Ban Phan Thom, Khet Phra Nakhon, Krung Thep Maha Nakhon 10200, Thailand").then( (msg)=>{
            console.log(msg);
        
            validateUserHasBooking("mcfaddenr.ebb@gmail.com","room 7").then( (msg)=>{
                console.log(msg);
            
            }); 
        }); 
    });
});


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
                    message += ",user is allowed access now";
                    else
                    message += ",user is not allowed access yet";
                    
                    resolve(message);
                    
                }
                
            }
            resolve("There is no booking for that room now");
            
        }).catch( err =>{
            console.log(err);
        });
   }); 
}
