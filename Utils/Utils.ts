/** 
 * Filename: Utils.ts
 * Version: V1.1
 * Author: JJ Goschen
 * Project name: A-Recognition (Advance)
 * Organization: Singularity
 * Funtional description: Provides functionality that does not belong to a specific component
*/

 /**
 * Filters an array/single object, if no options are passed through then deafault event filtering takes place and this will throw an error on non event objects
 * @param {any} data The array or single object to filter
 * @param {any} options Specifies what keys should be passed on to the new object
 * @returns {Array<any> | Object }
 */
export function filter(data : any,options : any) : Array<any> | Object{

    if(options == null || options == undefined){
        options = {
            id          : true,
            summary     : true,
            created     : true,
            creator     : true,
            organizer   : true,
            location    : true,
            start       : true,
            end         : true,
            attendees   : true
        }
    }

    if( Array.isArray(data))
        return arrayFilter(data,options);
    else 
        return objectFilter(data,options);

}

function arrayFilter(data : Array<any>,options : any){

    let dataArray = [];

        data.forEach(el => {
            dataArray.push( objectFilter(el,options) );
        });
    return dataArray;
}

function objectFilter(data,options){


    let filteredObject = {};

    for( var key in options){
        if(data.hasOwnProperty(key)){

            if(key == "start" || key == "end") //Time has special format so is handled differently
            filteredObject = formatTime(data[key],key,filteredObject);
            else if(key == "attendees")         //attendees has means we want email info
            filteredObject["attendees"] = getAttendeeEmails(data);
            else
            filteredObject[key] = data[key];
        }else 
            filteredObject[key] = null;
    }

    return filteredObject;
}

function formatTime(time : any,key : string,originalObject : any) : any{

    if(  time.dateTime != null){ //DateTime format provided
        originalObject[key+"Date"]   = time.dateTime.substring(0, time.dateTime.indexOf("T"));
        originalObject[key +"Time"]   = time.dateTime.substring(time.dateTime.indexOf("T")+1,time.dateTime.length);
    }else{ // No Time provided, whole day event?
        originalObject[key +"Date"]   = time;
    }

    return originalObject
}

function getAttendeeEmails(data : any) : any{
    
    let attendees = [];
        if( data.attendees != undefined && data.attendees != null && data.attendees.length != 0){
            
            data.attendees.forEach(attendee => {
                attendees.push(attendee.email);                   
            });

            return attendees;
        }else{
            return null;
        }
}
/**
 * Checks if an object is present in an array based on some key, if a non/empty array is passed in then false is returned.
 * @param {string} value The value of the key to compare against
 * @param {any} array The array of objects to search through
 * @param {string} key The key field of each object that is compared against 'value'
 * @returns {true | false}
 */
export function inArray(value : string,array : any,key : string = "normalArray") : boolean{

    if( !Array.isArray(array) ||  array.length == 0)
    return false;

    for (let i = 0; i < array.length; i++) {
      
        let obj = array[i];
        
        if(key === "normalArray"){  //Dealing with a normal array, not an array of objects
            
            if(obj=== value)
            return true;
        }else{
            if (obj.hasOwnProperty(key)) {
                
                   if(obj[key] == value)
                       return true;
               }
        }
 
    }
    
    return false;
}



