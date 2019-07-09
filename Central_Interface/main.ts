import * as Adapter from "../API_Adapter/main";
import * as Utils from "../Utils/Utils";

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

validateUserHasBooking("jarrodgoschen@gmail.com","djkf").then( (msg)=>{
    console.log(msg);

    validateUserHasBooking("jarrodgoschen@gmail.com","room 7").then( (msg)=>{
        console.log(msg);
    
        validateUserHasBooking("geekaverage@gmail.com","room 7").then( (msg)=>{
            console.log(msg);
        
            validateUserHasBooking("mcfaddenr.ebb@gmail.com","room 7").then( (msg)=>{
                console.log(msg);
            
            }); 
        }); 
    });
});


export function validateUserHasBooking(email : string,room : string) : Promise<any>{
    
   return new Promise( (resolve,reject) =>{
        Adapter.getEvents("primary",true,{attendees : true,location : true},2).then( (closestEvent)=>{

            console.log(closestEvent);
            
            let message = "";

            //Check user
            if( Utils.inArray(email,closestEvent[0].attendees))
            message += "User has a booking today";
            else
            message += "User does not have a booking";

            //Check room
            if(closestEvent[0].location == room)
            message += " & it is for that room";
            else
            message += " & it is the wrong room";

            resolve(message);
            
        });
   }); 
}
