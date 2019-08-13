//Firbase setup
var admin = require("firebase-admin");
var serviceAccount = require("./debug_credentials.json");
admin.initializeApp(
    {
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://arecognition-48c05.firebaseio.com"
    });
let db = admin.firestore();

//Express setup

var express = require('express');
var app = express();

var parser = require("body-parser");
app.use(parser.urlencoded({extended : false}));


//Helper functions
/** 
 * @description: Function that updates a user
 * @param requestBody: The body of the request
 * @param key: The field name to check
 * @param response: The response object of the request to serve
**/
function checkBody(requestBody, key, response)
{
    if(requestBody[key] == undefined || requestBody[key].length < 1){
        response.end(JSON.stringify(
            {
                "status" : "Failure",
                "message" : '\'' + key + '\' field was not specified!'
            }
        ));
        return false;
    }
    return true;
}

/** 
 * @description: Function to retrieve facial data and emails for facial recognition
**/
exports.retrieveEncodings = function retrieveEncodings(request,response){
    users = db.collection("users").get()
        .then(userSet => {
        var emails = [];
        var faceData = [];

        userSet.forEach(user => {
            if(user.get("active"))
            {
                emails.push(user.get("email"));
                faceData.push(user.get("fd"));
            }
        });
        
        //Return JSON object with two arrays; One with faces and the other with emails to match
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(
            {
                "emails" : emails,
                "fd" : faceData
            }
        ));
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
exports.register = function register(request,response){
    //Check for email field
    if(!checkBody(request.body, "email", response))
    {
        return;
    }

    //Check for name field
    if(!checkBody(request.body, "name", response))
    {
        return;
    }


    //Check for surname field
    if(!checkBody(request.body, "surname", response))
    {
        return;
    }

    //Check for title field
   if(!checkBody(request.body, "title", response))
   {
       return;
   }
    
    //Check for facial data field
    if(!checkBody(request.body, "fd", response))
    {
        return;
    }

    //Check for active field
    if(!checkBody(request.body, "active", response))
    {
        return;
    }

    if(request.body.active != 'false' && request.body.active != 'true')
    {
        response.end(JSON.stringify(
        {
            "status" : "Failure",
            "message" : "'active' field must be boolean ('true'/'false')"
        }
        ));
        return;
    }

    //Check if user exists
    var userRef = db.collection('users').doc(request.body.email);
    var getDoc = userRef.get()
        .then(doc => {
            if (doc.exists) //User exists 
            {
                response.end(JSON.stringify(
                    {
                        "status" : "Failure",
                        "message" : "Specified user already exists"
                    }
                ));
                return;
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
                        "fd" : JSON.parse(request.body.fd),
                        "active" : JSON.parse(request.body.active)
                    })
                .then(ref => {
                    console.log('Added user: ', request.body.email);
                    response.end(JSON.stringify(
                        {
                            "status" : "Success"
                        }));
                });
                return;
            }
        })
        .catch(err => {
            response.end(JSON.stringify(
                {
                    "status" : "Failure",
                    "message" : "Document could not be retrieved"
                }
            ));
            return;
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
exports.update = function update(request,response){
    //Check for email field
    if(!checkBody(request.body, "email", response))
    {
        return;
    }

    //Check for name field
    if(!checkBody(request.body, "name", response))
    {
        return;
    }


    //Check for surname field
    if(!checkBody(request.body, "surname", response))
    {
        return;
    }

    //Check for title field
   if(!checkBody(request.body, "title", response))
   {
       return;
   }
    
    //Check for facial data field
    if(!checkBody(request.body, "fd", response))
    {
        return;
    }

    //Check for active field
    if(!checkBody(request.body, "active", response))
    {
        return;
    }

    if(request.body.active != 'false' && request.body.active != 'true')
    {
        response.end(JSON.stringify(
        {
            "status" : "Failure",
            "message" : "'active' field must be boolean ('true'/'false')"
        }
        ));
        return;
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
                        "fd" : JSON.parse(request.body.fd),
                        "active" : JSON.parse(request.body.active)
                    })
                .then(ref => {
                    console.log('Updated: ', request.body.email);
                    response.end(JSON.stringify(
                        {
                            "status" : "Success"
                        }));
                });
            } 
            else //User does not exist
            {
                response.end(JSON.stringify(
                    {
                        "status" : "Failure",
                        "message" : "Specified user does not exist"
                    }
                ));
                return; //Stop as user does not exist 
            }
        })
        .catch(err => {
            response.end(JSON.stringify(
                {
                    "status" : "Failure",
                    "message" : "Document could not be retrieved"
                }
            ));
            return;
        });
}

/** 
 * @description: Function retrieves a given user
 * @param email: Email to identify a user
**/
exports.retrieveUser = function retrieveUser(request,response){
    //Check for email field
    if(!checkBody(request.body, "email", response))
    {
        return;
    }

    //Check if user exists
    var userRef = db.collection('users').doc(request.body.email);
    var getDoc = userRef.get()
        .then(doc => {
            if (doc.exists) //User exists 
            {
                response.end(JSON.stringify(
                    {
                        "status" : "Success",
                        "email" : doc.get("email"),
                        "name" : doc.get("name"),
                        "surname" : doc.get("surname"),
                        "title" : doc.get("title"),
                        "fd" : doc.get("fd")
                    }
                ));
            } 
            else //User does not exist
            {
                response.end(JSON.stringify(
                    {
                        "status" : "Failure",
                        "message" : "Specified user does not exist"
                    }
                ));
                return; //Stop as user does not exist 
            }
        })
        .catch(err => {
            response.end(JSON.stringify(
                {
                    "status" : "Failure",
                    "message" : "Document could not be retrieved"
                }
            ));
            return;
        });

}

/** 
 * @description: Function that retrieves an event
 * @param eventId: The eventId toidentify event
**/
exports.retrieveEvent = function retrieveEvent(request,response) {
    //Check for eventId field
    if(!checkBody(request.body, "eventId", response))
    {
        return;
    }

    //Check if event exists
    var eventsRef = db.collection('events').doc(request.body.eventId);
    var getDoc = eventsRef.get()
        .then(doc => {
            if (doc.exists) //Event exists 
            {
                response.end(JSON.stringify(
                {
                    "status" : "Success",
                    "location" : doc.get("location"),
                    "startTime" : doc.get("startTime"),
                    "endTime" : doc.get("endTime"),
                    "attendeeOTPpairs" : doc.get("attendees")
                }));
                return;
            } 
            else //Event does not exist
            {
                response.end(JSON.stringify(
                    {
                        "status" : "Failure",
                        "message" : "Specified event does not exist!"
                    }
                ));
                return; //Stop event does not exist
            }
        })
        .catch(err => {
            response.end(JSON.stringify(
                {
                    "status" : "Failure",
                    "message" : "Document could not be retrieved"
                }
            ));
            return;
        });
}

/** 
 * @description: Function retrieves a given user
 * @param email: Email to identify a user
**/
exports.retrieveUser = function retrieveUser(request,response){
    //Check for email field
    if(!checkBody(request.body, "email", response))
    {
        return;
    }

    //Check if user exists
    var userRef = db.collection('users').doc(request.body.email);
    var getDoc = userRef.get()
        .then(doc => {
            if (doc.exists) //User exists 
            {
                response.end(JSON.stringify(
                    {
                        "status" : "Success",
                        "email" : doc.get("email"),
                        "name" : doc.get("name"),
                        "surname" : doc.get("surname"),
                        "title" : doc.get("title"),
                        "fd" : doc.get("fd")
                    }
                ));
            } 
            else //User does not exist
            {
                response.end(JSON.stringify(
                    {
                        "status" : "Failure",
                        "message" : "Specified user does not exist"
                    }
                ));
                return; //Stop as user does not exist 
            }
        })
        .catch(err => {
            response.end(JSON.stringify(
                {
                    "status" : "Failure",
                    "message" : "Document could not be retrieved"
                }
            ));
            return;
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
exports.updateEvent = function updateEvent(request,response) {
    //Check for eventId field
    if(!checkBody(request.body, "eventId", response))
    {
        return;
    }

    //Check for location field
    if(!checkBody(request.body, "location", response))
    {
        return;
    }

    //Check for startTime field
    if(!checkBody(request.body, "startTime", response))
    {
        return;
    }

    //Check for endTime field
    if(!checkBody(request.body, "endTime", response))
    {
        return;
    }

    //Check for attendeeOTPpairs field
    if(!checkBody(request.body, "attendeeOTPpairs", response))
    {
        return;
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
                        "location" : request.body.location,
                        "startTime" : request.body.startTime,
                        "endTime" : request.body.endTime,
                        "attendees" : JSON.parse(request.body.attendeeOTPpairs)
                    })
                .then(ref => {
                    console.log('Updated Event: ' + request.body.eventId);
                    response.end(JSON.stringify(
                        {
                            "status" : "Success"
                        }));
                });
                return;
            } 
            else //Event does not exist
            {
                response.end(JSON.stringify(
                    {
                        "status" : "Failure",
                        "message" : "Specified event does not exist!"
                    }
                ));
                return; //Stop as event does not exist
            }
        })
        .catch(err => {
            response.end(JSON.stringify(
                {
                    "status" : "Failure",
                    "message" : "Document could not be retrieved"
                }
            ));
            return;
        });
}

/** 
 * @description: Function deletes an event
 * @param eventId: The event to deleted
**/
exports.deleteEvent = function deleteEvent(request,response) {
    //Check for eventId field
    if(!checkBody(request.body, "eventId", response))
    {
        return;
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
                response.end(JSON.stringify(
                    {
                        "status" : "Success",
                    }
                ));
                return;
            } 
            else //Event does not exist
            {
                response.end(JSON.stringify(
                    {
                        "status" : "Failure",
                        "message" : "Specified event does not exist!"
                    }
                ));
                return; //Stop as event already exists
            }
        })
        .catch(err => {
            response.end(JSON.stringify(
                {
                    "status" : "Failure",
                    "message" : "Document could not be retrieved"
                }
            ));
            return;
        });
}

/** 
 * @description: Function that adds a person to an event
 * @param eventId: The eventId toidentify event
 * @param email: Email to add to the event
 * @param otp: The OTP generated to allow access to the room
**/
exports.addAttendee = function addAttendee(request,response) {
    //Check for eventId field
    if(!checkBody(request.body, "eventId", response))
    {
        return;
    }

    //Check for email field
    if(!checkBody(request.body, "email", response))
    {
        return;
    }

    //Check for otp field
    if(!checkBody(request.body, "otp", response))
    {
        return;
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
                        response.end(JSON.stringify(
                            {
                                "status" : "Failure",
                                "message" : "Provided email is already registered in event!"
                            }
                        ));
                        return; //Stop as the email was already part of the event
                    }
        
                    emails.push(person.email);
                    otps.push(person.otp);
                });

                //Add the OTP to the event
                emails.push(request.body.email);
                otps.push(request.body.otp);

                attendeesArray = [];
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
                    response.end(JSON.stringify(
                        {
                            "status" : "Success"
                        }));
                });
                return;
            } 
            else //Event does not exist
            {
                response.end(JSON.stringify(
                    {
                        "status" : "Failure",
                        "message" : "Specified event does not exist"
                    }
                ));
                return; //Stop as event does not exist 
            }
        })
        .catch(err => {
            response.end(JSON.stringify(
                {
                    "status" : "Failure",
                    "message" : "Document could not be retrieved"
                }
            ));
            return;
        });
}

/** 
 * @description: Function that returns the emails and otps 
 * @param eventId: The eventId toidentify event
**/
exports.getEventAttendees = function getEventAttendees(request,response) {
    //Check for eventId field
    if(!checkBody(request.body, "eventId", response))
    {
        return;
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
                response.end(JSON.stringify(
                    {
                        "status" : "Succsess",
                        "attendeeOTPpairs" : doc.get("attendees")
                    }
                ));
                return;
            }
            else
            {
                response.end(JSON.stringify(
                    {
                        "status" : "Failure",
                        "message" : "Specified event does not exist!"
                    }
                ));
                return;
            }
        })
        .catch(err => {
            response.end(JSON.stringify(
                {
                    "status" : "Failure",
                    "message" : "Document could not be retrieved!"
                }
            ));
            return;
        });
}


/* For Testing */

app.post('/register', function (request, response)
{
    exports.register(request, response);
});

app.post('/retrieveEncodings', function (request, response)
{
    exports.retrieveEncodings(request, response);
});

app.post('/addEvent', function (request, response)
{
    exports.addEvent(request, response);
});

app.post('/retrieveEvent', function (request, response)
{
    exports.retrieveEvent(request, response);
});

app.post('/update', function (request, response)
{
    exports.update(request, response);
});

app.post('/updateEvent', function (request, response)
{
    exports.updateEvent(request, response);
});

app.post('/retrieveUser', function (request, response)
{
    exports.retrieveUser(request, response);
});

app.post('/addAttendee', function (request, response)
{
    exports.addAttendee(request, response);
});

app.post('/getEventAttendees', function (request, response)
{
    exports.getEventAttendees(request, response);
});

app.post('/deleteEvent', function (request, response)
{
    exports.deleteEvent(request, response);
});

console.log("Starting server...");
var server = app.listen(42069, function () 
{    
    console.log("Dope ass server listening at http://%s:%s", '127.0.0.1', 42069);
})
