//Firbase setup
import admin = require("firebase-admin");
var serviceAccount = require("./debug_credentials.json");
admin.initializeApp(
    {
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://arecognition-48c05.firebaseio.com"
    });
let db = admin.firestore();

//Helper functions
/** 
 * @description: Function that updates a user
 * @param requestBody: The body of the request
 * @param key: The field name to check
**/
function checkBody(requestBody, key)
{
    if(requestBody[key] == undefined || requestBody[key].length < 1){
        return false;
    }
    return true;
}

/** 
 * @description: Function to retrieve facial data and emails for facial recognition
**/
export async function retrieveEncodings() : Promise<any> {
    return new Promise( (resolve, reject) =>
    {   
        let users = db.collection("users").get()
            .then(userSet =>
            {
                let emails = [];
                let faceData = [];
                userSet.forEach(user => {
                    if(user.get("active"))
                    {
                        emails.push(user.get("email"));
                        faceData.push(user.get("fd"));
                    }
                });

                Promise.all([emails, faceData]).then( values =>
                {   
                    resolve({
                        "emails" : emails,
                        "fd" : faceData
                    });
                });

            });
    });
}

/** 
 * @description: Function that registers a user
 * @param email: Email to identify a user
 * @param name: The user's first name
 * @param surname: The user's surname
 * @param title: The user's title
 * @param fd: The user's facial data array
 * @param active: The user's active field
**/
export async function register(request) : Promise<any> {
    return new Promise ( (resolve, reject) =>
    {    
        //Check for email field
        if(!checkBody(request.body, "email"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'email\' field was not specified!'
            });
        }

        //Check for name field
        if(!checkBody(request.body, "name"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'name\' field was not specified!'
            });
        }


        //Check for surname field
        if(!checkBody(request.body, "surname"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'surname\' field was not specified!'
            });
        }

        //Check for title field
        if(!checkBody(request.body, "title"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'title\' field was not specified!'
            });
        }
        
        //Check for facial data field
        if(!checkBody(request.body, "fd"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'fd\' field was not specified!'
            });
        }

        //Check for active field
        if(!checkBody(request.body, "active"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'active\' field was not specified!'
            });
        }

        if(request.body.active != 'false' && request.body.active != 'true')
        {
            reject({
                "status" : "Failure",
                "message" : "'active' field must be boolean ('true'/'false')"
            });
        }

        //Check if user exists
        var userRef = db.collection('users').doc(request.body.email);
        var getDoc = userRef.get()
            .then(doc => {
                if (doc.exists) //User exists 
                {
                    reject({
                        "status" : "Failure",
                        "message" : "Specified user already exists"
                    });
                } 
                else //User does not exist
                {
                    //Update
                    let updateDoc = db.collection('users').doc(request.body.email).set(
                        {
                            "email" : request.body.email,
                            "name" : request.body.name,
                            "surname" : request.body.surname,
                            "title" : request.body.title,
                            "fd" : request.body.fd,
                            "active" : request.body.active
                        })
                    .then(ref => {
                        console.log('Added user: ', request.body.email);
                        resolve({
                                "status" : "Success"
                            });
                    });
                }
            })
            .catch(err => {
                reject({
                    "status" : "Failure",
                    "message" : "Document could not be retrieved"
                });
            });
    });
}

/** 
 * @description: Function that updates a user
 * @param email: Email to identify a user
 * @param name: The user's first name
 * @param surname: The user's surname
 * @param title: The user's title
 * @param fd: The user's facial data array
 * @param active: The user's active field
**/
export async function update(request) : Promise<any> {
    return new Promise( (resolve, reject) =>
    {
        //Check for email field
        if(!checkBody(request.body, "email"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'email\' field was not specified!'
            });
        }

        //Check for name field
        if(!checkBody(request.body, "name"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'name\' field was not specified!'
            });
        }


        //Check for surname field
        if(!checkBody(request.body, "surname"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'surnname\' field was not specified!'
            });
        }

        //Check for title field
        if(!checkBody(request.body, "title"))
        {
            reject({
                    "status" : "Failure",
                    "message" : '\'title\' field was not specified!'
                });
        }
        
        //Check for facial data field
        if(!checkBody(request.body, "fd"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'fd\' field was not specified!'
            });
        }

        //Check for active field
        if(!checkBody(request.body, "active"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'active\' field was not specified!'
            });
        }

        if(request.body.active != 'false' && request.body.active != 'true')
        {
            reject({
                "status" : "Failure",
                "message" : "'active' field must be boolean ('true'/'false')"
            });
        }
        //Check if user exists
        var userRef = db.collection('users').doc(request.body.email);
        var getDoc = userRef.get()
            .then(doc => {
                if (doc.exists) //User exists 
                {
                    //Update
                    let updateDoc = db.collection('users').doc(request.body.email).set(
                        {
                            "email" : request.body.email,
                            "name" : request.body.name,
                            "surname" : request.body.surname,
                            "title" : request.body.title,
                            "fd" : request.body.fd,
                            "active" : request.body.active
                        })
                    .then(ref => {
                        console.log('Updated user: ', request.body.email);
                        resolve({
                                "status" : "Success"
                        });
                    });
                } 
                else //User does not exist
                {
                    reject({
                        "status" : "Failure",
                        "message" : "Specified user does not exist!"
                    });
                }
            })
            .catch(err => {
                reject({
                    "status" : "Failure",
                    "message" : "Document could not be retrieved"
                });
            });
    });
}

/** 
 * @description: Function that adds a new event
 * @param eventId: The eventId toidentify event
 * @param location: The location of the venue
 * @param startTime: When the event starts
 * @param endTime: When the event stops
 * @param attendeeOTPpairs: JSON object array containg emails and their respective OTP
**/
export async function addEvent(request) : Promise<any> {
    
    return new Promise( (resolve, reject) => {
    //Check for eventId field
    if(!checkBody(request.body, "eventId"))
    {
        reject({
            "status" : "Failure",
            "message" : '\'eventId\' field was not specified!'
        });
    }

    //Check for location field
    if(!checkBody(request.body, "location"))
    {
        reject({
            "status" : "Failure",
            "message" : '\'location\' field was not specified!'
        });
    }

    //Check for startTime field
    if(!checkBody(request.body, "startTime"))
    {
        reject({
            "status" : "Failure",
            "message" : '\'startTime\' field was not specified!'
        });
    }

    //Check for endTime field
    if(!checkBody(request.body, "endTime"))
    {
        reject({
            "status" : "Failure",
            "message" : '\'endTime\' field was not specified!'
        });
    }

    //Check for attendeeOTPpairs field
    if(!checkBody(request.body, "attendeeOTPpairs"))
    {
        reject({
            "status" : "Failure",
            "message" : '\'attendeeOTPpairs\' field was not specified!'
        });
    }

    //Check if event exists
    var eventsRef = db.collection('events').doc(request.body.eventId);
    var getDoc = eventsRef.get()
        .then(doc => {
            if (doc.exists) //Event exists 
            {
                reject({
                    "status" : "Failure",
                    "message" : "Specified event already exists!"
                });
            } 
            else //Event does not exist
            {
                //Update DB event
                let newEvent = {
                    "eventId"  : request.body.eventId,
                    "summary"  : request.body.summary,
                    "location" : request.body.location,
                    "startTime" : request.body.startTime,
                    "endTime" : request.body.endTime,
                    "attendees" : request.body.attendeeOTPpairs,
                    "eventOTP"  : ""
                }

                let updateDoc = db.collection('events').doc(request.body.eventId).set(
                    newEvent)
                .then(ref => {
                    console.log('Updated Event: ' + request.body.eventId);
                    resolve({
                        "status" : "Success"
                    });
                });
            }
        })
        .catch(err => {
            console.log("Firebase could not add event");
            reject({
                "status" : "Failure",
                "message" : "Specified event does not exist!"
            });
        });
    });
}

/** 
 * @description: Function that retrieves an event
 * @param eventId: The eventId toidentify event
**/
export async function retrieveEvent(request) : Promise<any> {
    return new Promise( (resolve, reject) => {
        //Check for eventId field
        if(!checkBody(request.body, "eventId"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'eventId\' field was not specified!'
            });
        }

        //Check if event exists
        var eventsRef = db.collection('events').doc(request.body.eventId);
        var getDoc = eventsRef.get()
            .then(doc => {
                if (doc.exists) //Event exists 
                {
                    resolve({
                        "status" : "Success",
                        "eventId" : doc.get("eventId"),
                        "summary" : doc.get("summary"),
                        "location" : doc.get("location"),
                        "startTime" : doc.get("startTime"),
                        "endTime" : doc.get("endTime"),
                        "attendeeOTPpairs" : doc.get("attendees"),
                        "eventOTP"  : doc.get("eventOTP")
                    });
                } 
                else //Event does not exist
                {
                    reject({
                        "status" : "Failure",
                        "message" : "Specified event does not exist!"
                    });
                }
            })
            .catch(err => {
                reject({
                    "status" : "Failure",
                    "message" : "Document could not be retrieved!"
                });
            });
    });
}

/** 
 * @description: Function retrieves a given user
 * @param email: Email to identify a user
**/
export async function retrieveUser(request) : Promise<any> {
    return new Promise( (resolve, reject) => {
        //Check for email field
        if(!checkBody(request.body, "email"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'email\' field was not specified!'
            });
        }

        //Check if user exists
        var userRef = db.collection('users').doc(request.body.email);
        var getDoc = userRef.get()
            .then(doc => {
                if (doc.exists) //User exists 
                {
                    resolve({
                        "status" : "Success",
                        "email" : doc.get("email"),
                        "name" : doc.get("name"),
                        "surname" : doc.get("surname"),
                        "title" : doc.get("title"),
                        "fd" : doc.get("fd")
                    });
                } 
                else //User does not exist
                {
                    reject({
                        "status" : "Failure",
                        "message" : "Specified user does not exist!"
                    });
                }
            })
            .catch(err => {
                reject({
                    "status" : "Failure",
                    "message" : "Document could not be retrieved!"
                });
            });
    });
}

/** 
 * @description: Function that updates an event
 * @param eventId: The eventId toidentify event
 * @param location: The location of the venue
 * @param startTime: When the event starts
 * @param endTime: When the event stops
 * @param attendeeOTPpairs: JSON object array containg emails and their respective OTP
**/
export async function updateEvent(request) : Promise<any> {
    return new Promise( (resolve, reject) => {
        //Check for eventId field
        if(!checkBody(request.body, "eventId"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'eventId\' field was not specified!'
            });
        }

        if(!checkBody(request.body, "summary"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'summary\' field was not specified!'
            });
        }

        //Check for location field
        if(!checkBody(request.body, "location"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'location\' field was not specified!'
            });
        }

        //Check for startTime field
        if(!checkBody(request.body, "startTime"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'startTime\' field was not specified!'
            });
        }

        //Check for endTime field
        if(!checkBody(request.body, "endTime"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'endTime\' field was not specified!'
            });
        }

        //Check for attendeeOTPpairs field
        if(!checkBody(request.body, "attendeeOTPpairs"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'attendeeOTPpairs\' field was not specified!'
            });
        }

        if(!checkBody(request.body, "eventOTP")){
            request.body["eventOTP"] = "";
        }
        //Check if event exists
        var eventsRef = db.collection('events').doc(request.body.eventId);
        var getDoc = eventsRef.get()
            .then(doc => {
                if (doc.exists) //Event exists 
                {
                    //Update DB event
                    let updateDoc = db.collection('events').doc(request.body.eventId).set(
                        {
                            "eventId" : request.body.eventId,
                            "summary" : request.body.summary,
                            "location" : request.body.location,
                            "startTime" : request.body.startTime,
                            "endTime" : request.body.endTime,
                            "attendees" : request.body.attendeeOTPpairs,
                            "eventOTP"  : request.body.eventOTP
                        })
                    .then(ref => {
                        console.log('Updated Event: ' + request.body.eventId);
                        resolve({
                            "status" : "Success"
                        });
                    });
                } 
                else //Event does not exist
                {
                    reject({
                        "status" : "Failure",
                        "message" : "Specified event does not exist!"
                    });
                }
            })
            .catch(err => {
                reject({
                    "status" : "Failure",
                    "message" : "Specified event does not exist!"
                });
            });
    });
}

/** 
 * @description: Function deletes an event
 * @param eventId: The event to deleted
**/
export async function deleteEvent(request) : Promise<any> {
    return new Promise( (resolve, reject) => {
        //Check for eventId field
        if(!checkBody(request.body, "eventId"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'eventId\' field was not specified!'
            });
        }

        //Check if event exists
        var eventsRef = db.collection('events').doc(request.body.eventId);
        var getDoc = eventsRef.get()
            .then(doc => {
                if (doc.exists) //Event exists 
                {
                    //Delete event
                    eventsRef.delete();
                    console.log("Deleted eventId: \'" + request.body.eventId + '\'');
                    resolve({
                        "status" : "Success",
                    });
                } 
                else //Event does not exist
                {
                    reject({
                        "status" : "Failure",
                        "message" : "Specified event does not exist!"
                    });
                }
            })
            .catch(err => {
                reject({
                    "status" : "Failure",
                    "message" : "Document could not be retrieved!"
                });
            });
    });
}

/** 
 * @description: Function that adds a person to an event
 * @param eventId: The eventId toidentify event
 * @param email: Email to add to the event
 * @param otp: The OTP generated to allow access to the room
**/
export async function addAttendee(request) : Promise<any> {
    return new Promise( (resolve, reject) => {
        //Check for eventId field
        if(!checkBody(request.body, "eventId"))
        {
            reject( {
                "status" : "Failure",
                "message" : '\'eventId\' field was not specified!'
            });
        }

        //Check for email field
        if(!checkBody(request.body, "email"))
        {
            reject({
                "status" : "Failure",
                "message" : '\'email\' field was not specified!'
            });
        }

        //Check for otp field
        if(!checkBody(request.body, "otp"))
        {
            reject( {
                "status" : "Failure",
                "message" : '\'otp\' field was not specified!'
            });
        }

        //Check if event exists
        var eventsRef = db.collection('events').doc(request.body.eventId);
        var getDoc = eventsRef.get()
            .then(doc => {
                if (doc.exists) //Event exists 
                {
                    //Load the current otp/emails registered for this event
                    var emails = [];
                    var otps = [];

                    doc.get("attendees").forEach(person => {
                        //Check if email already exists
                        if(person.email == request.body.email)
                        {
                            resolve({
                                "status" : "Failure",
                                "message" : "Provided email is already registered in event!"
                            });
                        }
            
                        emails.push(person.email);
                        otps.push(person.otp);
                    });

                    //Add the OTP to the event
                    emails.push(request.body.email);
                    otps.push(request.body.otp);

                    let attendeesArray = [];
                    for(let a = 0; a < emails.length; a++)
                    {
                        attendeesArray.push({"email" : emails[a], "otp" : otps[a]});
                    }

                    var objectToSend =
                    {
                        "location" : doc.get('location'),
                        "startTime" : doc.get("startTime"),
                        "endTime" : doc.get("endTime"),
                        "attendees" : attendeesArray
                    };

                    //Save updated event to DB
                    let updateDoc = db.collection('events').doc(request.body.eventId).set(
                        objectToSend
                        )
                    .then(ref => {
                        console.log('Added \' ' + request.body.email + '\' to event: ' + request.body.eventId);
                        resolve({
                            "status" : "Success"
                        });
                    });
                } 
                else //Event does not exist
                {
                    reject({
                        "status" : "Failure",
                        "message" : "Specified event does not exist!"
                    });
                }
            })
            .catch(err => {
                reject({
                    "status" : "Failure",
                    "message" : "Document could not be retrieved!"
                });
            });
    });
}

/** 
 * @description: Function that returns the emails and otps 
 * @param eventId: The eventId toidentify event
**/
export function getEventAttendees(request) : Promise<any> {
    return new Promise( (resolve, reject) => {
            //Check for eventId field
            if(!checkBody(request.body, "eventId"))
            {
                reject({
                    "status" : "Failure",
                    "message" : '\'eventId\' field was not specified!'
                });
            }
    
            //Check if event exists
            var eventsRef = db.collection('events').doc(request.body.eventId);
            var getDoc = eventsRef.get()
                .then(doc => {
                    if (doc.exists) //Event exists 
                    {
                        //Load the current otp/emails registered for this event
                        var emails = [];
                        var otps = [];
    
                        //Return the attendees
                        resolve ({
                            "status" : "Success",
                            "attendeeOTPpairs" : doc.get("attendees")
                        });
                    }
                    else
                    {
                        reject({
                            "status" : "Failure",
                            "message" : "Specified event does not exist!"
                        });
                    }
                })
                .catch(err => {
                    reject({
                        "status" : "Failure",
                        "message" : "Document could not be retrieved!"
                    });
                });
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////
/*
console.debug(exports.addEvent({ "body" : {
                                "eventId" : "functionTestEvent",
                                "location" : "functionLocation",
                                "startTime" : "1/1/2001 01:01",
                                "endTime" : "1/1/2001 02:02",
                                "attendeeOTPpairs" : [
                                                        {
                                                            "email" : "functionEmail@gmail.com",
                                                            "otp" : "1111"
                                                        },
                                                        {
                                                            "email" : "functionEmail2@gmail.com",
                                                            "otp" : "2222"
                                                        }
                                                     ]
                            }
                }));
*/
/*
let result = this.retrieveEncodings({}, {}).then( (res) => {
    console.debug(res);
});
*/
/*
    "email" : request.body.email,
    "name" : request.body.name,
    "surname" : request.body.surname,
    "title" : request.body.title,
    "fd" : JSON.parse(request.body.fd),
    "active" : JSON.parse(request.body.active)
*/
/*
let result = this.register({ "body" :   {
                       let result = this.update({ "body" :   {
    "email" : "registerFunction@gmail.com",
    "name" : "newName",
    "surname" : "newSurname",
    "title" : "Mr",
    "fd" : [ 0.1, 0.2, 0.3],
    "active" : "true"
    }
}, {}).then( (res) => {
console.debug(res);
});                 "email" : "registerFunction@gmail.com",
                                        "name" : "register",
                                        "surname" : "Function",
                                        "title" : "Mr",
                                        "fd" : [ 0.1, 0.2, 0.3],
                                        "active" : "true"
                                        }
                            }, {}).then( (res) => {
    console.debug(res);
});
*/

/*
let result = this.update({ "body" :   {
    "email" : "registerFunction@gmail.com",
    "name" : "newName",
    "surname" : "newSurname",
    "title" : "Mr",
    "fd" : [ 0.1, 0.2, 0.3],
    "active" : "true"
    }
}, {}).then( (res) => {
console.debug(res);
});
*/

/*
let result = this.addEvent({ "body" :   {
    "eventId" : "addEventFunction@gmail.com",
    "location" : "addEventFunction",
    "startTime" : "16:20",
    "endTime" : "17:20",
    "attendeeOTPpairs" : [
        {
            "email" : "email1@gmal",
            "otp" : "6969"
        },
        {
            "email" : "blahBah",
            "otp" : "2468"
        }
    ]
    }
}, {}).then( (res) => {
console.debug(res);
});
*/

/*
let result = this.retrieveEvent({ "body" :   {
    "eventId" : "addEventFunction@gmail.com"
    }
}, {}).then( (res) => {
console.debug(res);
});
*/

/*
let result = this.retrieveUser({ "body" :   {
    "email" : "registerFunction@gmail.com"
    }
}, {}).then( (res) => {
console.debug(res);
});
*/

/*
let result = this.updateEvent({ "body" :   {
    "eventId" : "addEventFunction@gmail.com",
    "location" : "UPDATED!!!addEventFunction",
    "startTime" : "16:20",
    "endTime" : "17:20",
    "attendeeOTPpairs" : [
        {
            "email" : "email1@gmal",
            "otp" : "6969UPDATE"
        },
        {
            "email" : "blahBah",
            "otp" : "2468"
        }
    ]
    }
}, {}).then( (res) => {
console.debug(res);
});
*/

/*
let result = this.deleteEvent({ "body" :   {
    "eventId" : "addEventFunction@gmail.com"
    }
}, {}).then( (res) => {
console.debug(res);
});
*/

/*
let result = this.addAttendee({ "body" :   {
    "eventId" : "functionTestEvent",
    "email" : "addedATTENDEE",
    "otp" : "addedOTP"
    }
}, {}).then( (res) => {
console.debug(res);
});
*/
/*
let result = this.getEventAttendees({ "body" :   {
    "eventId" : "functionTestEvent"
    }
}, {}).then( (res) => {
console.debug(res);
});
*/
