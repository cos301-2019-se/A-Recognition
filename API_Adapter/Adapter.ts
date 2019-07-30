/** 
 * Filename: Adapter.ts
 * Version: V1.2
 * Author: JJ Goschen
 * Project name: A-Recognition (Advance)
 * Organization: Singularity
 * Funtional description: Provides an adapter that allows communication with various calendar API's
*/
const adaptees = ["google","microsoft"];
import {GoogleAdaptee} from "./GoogleAdaptee";
import {MicrosoftAdaptee} from "./MicrosoftAdaptee";
import * as Utils from "../Utils/Utils";

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
 * @param {string | null} target the name of the target platform eg. Microsoft/Google, if undefined then switch to the next available adaptee
 */
    changeAdaptee(target : string | null = null) : string{

        if(target == null || target == undefined){   //target undefined, choose next available adaptee
            target = adaptees[ ++this.currentAdapteeIndex % adaptees.length];
            this.currentAdapteeIndex = this.currentAdapteeIndex % adaptees.length;
        }
                 
        target = target.toLowerCase();
        
            switch (target) {
                case "google" :
                    this.adaptee = new GoogleAdaptee();
                    this.currentAdapteeIndex = 0;
                    break;

                case "microsoft" :
                    this.adaptee = new MicrosoftAdaptee();
                    this.currentAdapteeIndex = 1;
                    break;
            
                default:
                    this.adaptee = new GoogleAdaptee();
                    this.currentAdapteeIndex = 0;
                    break;
            }

        return target;
    }
/**
 * retrieves the scheduled events of a specific user or returns a null object if there are none
 * @param {string | number} identifier the user identifier of choice
 * @param {boolean} filter whether the result should be filtered into a simpler JSON object
 * @param {any} options if left out then standard filtering is applied otherwise options specifies what keys should be passed on to the new object
 * @returns {Object[] | string }
 */
    retrieveUserEvents(identifier : string, filter : boolean, options: any,resultSize : number,endTime : string) : Promise<any>{
        
        return new Promise( (resolve,reject)=>{

            this.adaptee.getUserEvents(identifier,resultSize,endTime).then( (bookings)=>{

                if(!filter)
                resolve(bookings);
                else 
                resolve(Utils.filter(bookings,options));
            }).catch( (err)=>{
                //Most probably no events, but possibly something else
                reject(err);
            })
        });
    }


/**
 * retrieves the scheduled events of a specific user or returns a null object if there are none
 */
    retrieveUserCalendars() : Promise<any>{
            
        return new Promise( (resolve,reject)=>{

            this.adaptee.getUserCalendars().then( (calendarList)=>{    
                resolve(calendarList);
               
            }).catch( (err)=>{
                reject(err);
            })
        })
    
    }
}

