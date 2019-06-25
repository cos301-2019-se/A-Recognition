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
                organizer   : el.organizer,
                start       : el.start,
                end         : el.end
            }; 
            dataArr.push(filteredObject);
        });
    }
    
    return dataArr;
}