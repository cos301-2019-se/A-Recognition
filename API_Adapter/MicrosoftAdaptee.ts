/**
* Adaptee responsible for exchanging data with Microsoft Office 365
*/
export class MicrosoftAdaptee{

    constructor(){}

/**
 * retrieves the scheduled events of a specific user
 * @param {any} identifier the user identifier of choice
 */
    async getUserEvents(identifier : string | number): Promise<any>{

        return new Promise( (resolve,reject)=>{
            console.log("hey");
            
            resolve("I am not implemented yet");
        })
        
    }

    /**
 * retrieves the calendars associated with a user
 */
    async getUserCalendars() : Promise<any>{
        
        return new Promise( (resolve,reject)=>{
            resolve("I am not implemented yet");
        })
    }
}