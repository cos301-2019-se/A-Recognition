/**
* Adaptee responsible for exchanging data with Microsoft Office 365
* npm install simple-oauth2 --save
*/
// const credentials = {
//     userName : "8a223ec8-d71f-4",
//     password : "ImOOkg/A+Rz4dN+3NO"
// }

// import { ExchangeService, ExchangeVersion, WebCredentials, Uri, DateTime, CalendarView, WellKnownFolderName, EwsLogging } from "ews-javascript-api";
// EwsLogging.DebugLogEnabled = false;

// var service = new ExchangeService(ExchangeVersion.Exchange2010);
// service.Credentials = new WebCredentials(credentials.userName, credentials.password);
// service.Url = new Uri("https://outlook.office365.com/Ews/Exchange.asmx");

// var view = new CalendarView(DateTime.Now,DateTime.Now.Add(1, "week")); 

// console.log(service);

// service.FindAppointments(WellKnownFolderName.Calendar, view).then((response) => {
//     let appointments = response.Items;
//     let appointment = appointments[0];
//     console.log("Subject: " + appointment.Subject);
//     console.log("Start Time: " + appointment.Start);
//     console.log("End Time: " + appointment.End);
//     console.log("Recipients: ");
//     // appointment.RequiredAttendees.Items.forEach((a) => {
//     //     console.log(a.Address);
//     // });
//     console.log("unique id: " + appointment.Id.UniqueId, true, true);

// }, function (error) {
//     console.log(error);
// })
export class MicrosoftAdaptee{

    constructor(){}

/**
 * retrieves the scheduled events of a specific user
 * @param {any} identifier the user identifier of choice
 */
async getUserEvents(identifier : string = "primary",resultSize : number = -1,endTimeISOString : string) : Promise<any>{

        return new Promise( (resolve,reject)=>{ 
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
