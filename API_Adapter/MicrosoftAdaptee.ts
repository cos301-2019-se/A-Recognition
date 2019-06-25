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
        console.log("I am not implemented yet");
    }

    /**
 * retrieves the calendars associated with a user
 */
    async getUserCalendars() : Promise<any>{
        console.log("I am not implemented yet");
    }
}