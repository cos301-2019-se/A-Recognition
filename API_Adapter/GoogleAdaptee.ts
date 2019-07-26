/** 
 * Filename: GoogleAdaptee.ts
 * Version: V1.1 - Scoped as final version
 * Author: JJ Goschen
 * Project name: A-Recognition (Advance)
 * Organization: Singularity
 * Funtional description: Provides functionality for communication with Google Calendar
*/
import * as fs from 'fs';
import * as readline from 'readline';
import {google} from 'googleapis'; //npm install googleapis@39 --save

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

/**
* Adaptee responsible for exchanging data with Google Calendar
*/
export class GoogleAdaptee{

    CREDENTIAL_PATH : string;
    TOKEN_PATH : string;


    constructor(){
        var path = require("path");
        
        var absolutePath = path.resolve("..");
        absolutePath += "/API_Adapter/";

        this.CREDENTIAL_PATH = absolutePath + "credentials.json";
        this.TOKEN_PATH = absolutePath + "token.json";
    }

/**
 * retrieves the scheduled events of a specific user
 * @param {string} identifier The calendar identifier
 * @param {number} resultSize Amount of events returned
 * @param {string} endTimeISOString ISO string of end of search time, defaults to end of the day
 */
    async getUserEvents(identifier : string = "primary",resultSize : number = -1,endTimeISOString : string) : Promise<any>{

       return new Promise( (resolve,reject)=>{ 
            this.loadClientSecrets()
            .then( (credentials)=>{ return credentials;})
            .catch( err => reject(err))
        .then( (credentials) =>{ this.authorize(credentials)
        .then( (oAuth2Client)=>{ this.listEvents(oAuth2Client,identifier,resultSize,endTimeISOString)
        .then( (bookings)=>{ resolve(bookings);})
        .catch( (err)=>{ reject(err);})})
        .catch( (err)=>{ reject(err);})})
        .catch( (err)=>{ reject(err);})})
    }

/**
 * retrieves the calendars associated with a user
 */
    getUserCalendars() : Promise<any>{

        return new Promise( (resolve,reject)=>{
            this.loadClientSecrets().then( (credentials)=>{
                return credentials;
            }).then( (credentials) =>{
                this.authorize(credentials).then( (oAuth2Client)=>{
                    this.getUserCalendarList(oAuth2Client).then( (userCalendars)=>{
                        resolve(userCalendars);
                        });
                }).catch( (err)=>{
                    reject(err);
                })
            }).catch( (err)=>{
                reject(err);
            } )
       })
       
    }


/**
 * Load client secrets from a local file.
 */
    loadClientSecrets() : Promise<any>{
        
        return new Promise((resolve, reject) => {
            fs.readFile(this.CREDENTIAL_PATH, (err, content) => {

                if (err)
                    reject('Error loading client secret file:'+ err); 
                else
                    resolve(JSON.parse(content.toString())); 
            });  
        })
    }

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 */
    authorize(credentials : any) : Promise<any> {

        return new Promise( (resolve,reject)=>{

            const {client_secret, client_id, redirect_uris} = credentials.installed;
            const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
           
            // Check if we have previously stored a token.
            fs.readFile(this.TOKEN_PATH, (err, token) => {
            if (err)
                this.getAccessToken(oAuth2Client).then( (oAuth2Client)=>{
                    resolve(oAuth2Client);
                }).catch( (err)=>{
                    reject(err);
                })
            else
                oAuth2Client.setCredentials(JSON.parse(token.toString()));
                resolve(oAuth2Client);
            });
        })
    }

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
    getAccessToken(oAuth2Client : any) : Promise<any>{

        return new Promise( (resolve,reject)=>{

            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES,
                });
        
                //Prompt user to authorise the app
                console.log('Authorize this app by visiting this url:', authUrl);
                const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
                });
        
                //Prompt user to enter their code from google
                rl.question('Enter the code from that page here: ', (code) => {
                    
                    rl.close();
        
                    //Get token
                    oAuth2Client.getToken(code, (err, token) => {
                        if (err) reject('Error retrieving access token'+ err);
        
                        oAuth2Client.setCredentials(token);
                        // Store the token to disk for later program executions
                        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                        if (err) reject(err);
                        console.log('Token stored to', TOKEN_PATH);
                        });
                        return resolve(oAuth2Client);
                    });
                });
        })
  }

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} calendarId The calendar identifier
 * @param {number} resultSize Amount of events returned
 * @param {string} endTimeISOString ISO string of end of search time, defaults to end of the day
 * 
 */
    listEvents(auth,calendarId : string,resultSize : number,endTimeISOString : string = "") : Promise<any> {

        if(resultSize == -1)
        resultSize = 250;

        return new Promise( (resolve,reject)=>{

            
            const calendar = google.calendar({version: 'v3', auth});

            if(endTimeISOString === ""){
                let endTime =  new Date();    //Create a date object
                endTime.setHours(23,59,59,999); //And set its time to be the end of today * SA is UTC + 2
                //console.log(endTime.toISOString());
                endTimeISOString = endTime.toISOString();
            }
            
            
            calendar.events.list({
                calendarId: calendarId,      // This may have to be changed to the companies specified calender used for room bookings
                timeMin: (new Date()).toISOString(),
                timeMax: endTimeISOString,
                maxResults: resultSize,
                singleEvents: true,
                orderBy: 'startTime',
                }, (err, res) => {

                if (err) 
                    reject('The API returned an error: ' + err);
                
                const bookings = res.data.items;
                if (bookings.length) {
                    bookings.map((event, i) => {
                    });
                    
                    resolve(bookings) ;
                } else 
                    reject('No upcoming events found.');
                
            });
        });

  }

  /**
 * Lists all calendars associated with a user
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
    getUserCalendarList(auth) : Promise<any> {

    return new Promise( (resolve,reject)=>{

        const calendar = google.calendar({version: 'v3', auth});
        calendar.calendarList.list({showHidden: true}).then( (list)=>{
            
            if(list.data.items.length <= 0)
            reject([]);
            
            let userCalendars = [];

            list.data.items.forEach(calendar => {
                userCalendars.push({calendarId :calendar.id,calendarTitle : calendar.summary});
            });
            
            resolve(userCalendars);
        });
        
    });
}
}

