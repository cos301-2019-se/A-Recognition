/**
 * Utility functions that dont belong to a specific class.
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

        

        data.forEach(el => {
            let filteredObject = {};

            for( var key in options){
                if(options.hasOwnProperty(key)){
                    if(el[key] != undefined)
                    filteredObject[key] = el[key];
                }
            }

            dataArr.push(filteredObject);
        });
        
    }

    
    return dataArr;
}