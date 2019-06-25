import {Adapter} from "./Adapter";

let adapter = new Adapter();
adapter.retrieveUserEvents(0,true,null)
.then( (bookings)=>console.log(bookings))
.catch( ()=>{});
