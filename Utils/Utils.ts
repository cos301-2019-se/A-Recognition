/**
 * Utility functions that dont belong to a specific class.
 */

 /**
 * Filters an array/single object, if no options are passed through then deafault event filtering takes place and this will throw an error on non event objects
 * @param {any} data The array or single object to filter
 * @param {any} options Specifies what keys should be passed on to the new object
 * @returns {Object[] | Object }
 */
export function filter(data : any,options : any){

    let dataArr = [];
    
    if(options == null || options == undefined){

        data.forEach(el => {
            let filteredObject = {
                id          : el.id,
                status      : el.status,
                created     : el.created,
                creator     : el.creator,
                organizer   : el.organizer,
                title       : el.summary,
            }; 

            if(el.location != null && el.location != undefined)
                filteredObject["location"] = el.location;
            else 
                filteredObject["location"] = "No locations specified";
                
            if(el.start.dateTime != null && el.start.dateTime != undefined){ //DateTime format provided
                filteredObject["startDate"]   = el.start.dateTime.substring(0, el.start.dateTime.indexOf("T"));
                filteredObject["startTime"]   = el.start.dateTime.substring(el.start.dateTime.indexOf("T")+1,el.start.dateTime.length);
            }else{ // No Time provided, whole day event?
                filteredObject["startDate"]   = el.start.date;
            }

            if(el.end.dateTime != null && el.end.dateTime != undefined){ //DateTime format provided
                filteredObject["endDate"]   = el.end.dateTime.substring(0, el.end.dateTime.indexOf("T"));
                filteredObject["endTime"]   = el.end.dateTime.substring(el.end.dateTime.indexOf("T")+1,el.end.dateTime.length);
            }else{ // No Time provided, whole day event?
                filteredObject["endDate"]   = el.end.date;
            }
   
            if(el.description != null && el.description != undefined)
            filteredObject["description"] = el.description;
            else 
            filteredObject["description"] = "No description";


            filteredObject["attendees"] = [];
            if(el.attendees != null && el.attendees != undefined && el.attendees.length != 0){
                
                el.attendees.forEach(attendee => {
                    filteredObject["attendees"].push(attendee.email);                   
                });
            }
            dataArr.push(filteredObject);
        });

    }else{  // Custom filter options

        if( Array.isArray(data)){   // Passed an array of objects
            data.forEach(el => {
                let filteredObject = {};
    
                for( var key in options){

                    if(el.hasOwnProperty(key)){

                        if(key == "attendees"){
                            filteredObject["attendees"] = [];

                            el.attendees.forEach(attendee => {
                                filteredObject["attendees"].push(attendee.email);                   
                            });
                        }else
                            filteredObject[key] = el[key];
                    }
                        
                    else 
                        filteredObject[key] = undefined;
                    
                }
    
                dataArr.push(filteredObject);
            });
        }else{
            let filteredObject = {};
    
                for( var key in options){
                    if(data.hasOwnProperty(key))
                        filteredObject[key] = data[key];
                    else 
                        filteredObject[key] = undefined;
                }
    
                return filteredObject;
            }

        }
         
    return dataArr;
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

            if(obj == value)
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
