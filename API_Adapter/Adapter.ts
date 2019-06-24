const adaptees = ["google","microsoft"];
import {GoogleAdaptee} from "./GoogleAdaptee";
import {MicrosoftAdaptee} from "./MicrosoftAdaptee";
import * as Utils from "./Utils";

/**
 * Adapter responsible for passing on requests from client to respective adaptee
 * @var {googleAdaptee} adaptee the target adaptee for booking information
 */
export class Adapter{

    adaptee : GoogleAdaptee | MicrosoftAdaptee;
    currentAdapteeIndex : number;

    constructor(){
        this.adaptee = new GoogleAdaptee();
        this.currentAdapteeIndex = 0;
    }
    
/**
 * changes the target adaptee for the adapter
 * @param {string} target the name of the target platform eg. Microsoft/Google, if undefined then switch to the next available adaptee
 */
    changeAdaptee(target : string) : void{

        if(target == null || target == undefined)   //target undefined, choose next available adaptee
            target = adaptees[this.currentAdapteeIndex = (this.currentAdapteeIndex++ % adaptees.length)];

            switch (target.toLowerCase()) {
                case "google" :
                    this.adaptee = new GoogleAdaptee();
                    break;

                case "microsoft" :
                        this.adaptee = new MicrosoftAdaptee();
                        break;
            
                default:
                    this.adaptee = new GoogleAdaptee();
                    break;
            }
    }
/**
 * retrieves the scheduled events of a specific user
 * @param {string | number} identifier the user identifier of choice
 * @param {boolean} filter whether the result should be filtered into a simpler JSON object
 * @param {any} options if left out then standard filtering is applied otherwise options specifies what keys should be passed on to the new object
 */
    retrieveUserEvents(identifier : string | number, filter : boolean, options: any){
        this.adaptee.retrieveUserEvents(identifier).then( (bookings)=>{

            //console.log("Filtering result");

            if(!filter)
            return bookings;
            else 
            return Utils.filter(bookings,options);
        })
        
       
        

        
    }
}