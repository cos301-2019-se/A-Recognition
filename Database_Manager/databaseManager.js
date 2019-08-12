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
// var express = require('express');
// var app = express();

//var parser = require("body-parser");
//app.use(parser.urlencoded({extended : false}));

//Helper functions

//Hey I saw the oppertunity to function-ise your if statements
function checkBody(requestBody,key,message,response){
    if(requestBody[key] == undefined || requestBody[key].length < 1){
        response.end(JSON.stringify(
            {
                "status" : "Failure",
                "message" : message
            }
        ));
        return false;
    }
    return true;
}
function validateUserObject(request, response)
{
    var valid = true;
    
    //Check for email field
    if(request.body.email == undefined || request.body.email.length < 1)
    {
        response.end(JSON.stringify(
            {
                "status" : "Failure",
                "message" : "'email' field was not specified"
            }
        ));
        valid = false;
    }

    //Check for name field
    if(request.body.name == undefined || request.body.name.length < 1)
    {
        response.end(JSON.stringify(
            {
                "status" : "Failure",
                "message" : "'name' field was not specified"
            }
        ));
        valid = false;
    }

    //Check for surname field
    if(request.body.surname == undefined || request.body.surname.length < 1)
    {
        response.end(JSON.stringify(
            {
                "status" : "Failure",
                "message" : "'surname' field was not specified"
            }
        ));
        valid = false;
    }

    //Check for title field
    if(request.body.title == undefined || request.body.title.length < 1)
    {
        response.end(JSON.stringify(
            {
                "status" : "Failure",
                "message" : "'title' field was not specified"
            }
        ));
        valid = false;
    }
    
    //Check for facial data field
    if(request.body.fd == undefined || request.body.fd.length < 1)
    {
        response.end(JSON.stringify(
            {
                "status" : "Failure",
                "message" : "'fd' field was not specified. If no facial data is known please indicate with '[]'"
            }
        ));
        valid = false;
    }

    //Check for active field
    if(request.body.active == undefined || request.body.active.length < 1)
    {
        response.end(JSON.stringify(
            {
                "status" : "Failure",
                "message" : "'active' field was not specified."
            }
        ));
        valid = false;
    }

    if(request.body.active != 'false' && request.body.active != 'true')
    {
        response.end(JSON.stringify(
        {
            "status" : "Failure",
            "message" : "'active' field must be boolean ('true'/'false')"
        }
        ));
        valid = false;
    }

    return valid;
}

//Endpoint for retrieving known email-facial data pairs (To be used for facial recognition)
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
// app.post('/retrieveEncodings', function (request, response) {
//     //Get known face encodings from the DB with their respective email addresses
//     users = db.collection("users").get()
//         .then(userSet => {
//         var emails = [];
//         var faceData = [];

//         userSet.forEach(user => {
//             if(user.get("active"))
//             {
//                 emails.push(user.get("email"));
//                 faceData.push(user.get("fd"));
//             }
//         });
        
//         //Return JSON object with two arrays; One with faces and the other with emails to match
//         response.setHeader('Content-Type', 'application/json');
//         response.end(JSON.stringify(
//             {
//                 "emails" : emails,
//                 "fd" : faceData
//             }
//         ));
//     });
// });

exports.register = function register(request,response){
    if(!validateUserObject(request, response))
    {
        return; //Stop registration as information provided was not sufficient
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
                    console.log('Updated: ', request.body.email);
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

// app.post('/register', function (request, response) 
// {
//     if(!validateUserObject(request, response))
//     {
//         return; //Stop registration as information provided was not sufficient
//     }

//     //Check if user exists
//     var userRef = db.collection('users').doc(request.body.email);
//     var getDoc = userRef.get()
//         .then(doc => {
//             if (doc.exists) //User exists 
//             {
//                 response.end(JSON.stringify(
//                     {
//                         "status" : "Failure",
//                         "message" : "Specified user already exists"
//                     }
//                 ));
//                 return;
//             } 
//             else //User does not exist
//             {
//                 //Update
//                 let updateDoc = db.collection('users').doc(request.body.email).set(
//                     {
//                         "email" : request.body.email,
//                         "name" : request.body.name,
//                         "surname" : request.body.surname,
//                         "title" : request.body.title,
//                         "fd" : JSON.parse(request.body.fd),
//                         "active" : JSON.parse(request.body.active)
//                     })
//                 .then(ref => {
//                     console.log('Updated: ', request.body.email);
//                     response.end(JSON.stringify(
//                         {
//                             "status" : "Success"
//                         }));
//                 });
//                 return;
//             }
//         })
//         .catch(err => {
//             response.end(JSON.stringify(
//                 {
//                     "status" : "Failure",
//                     "message" : "Document could not be retrieved"
//                 }
//             ));
//             return;
//         });
// });

exports.update = function update(request,response){
    if(!validateUserObject(request, response))
    {
        return; //Stop update operation as information provided was not sufficient
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
// app.post('/update', function (request, response)
// {
//     if(!validateUserObject(request, response))
//     {
//         return; //Stop update operation as information provided was not sufficient
//     }

//     //Check if user exists
//     var userRef = db.collection('users').doc(request.body.email);
//     var getDoc = userRef.get()
//         .then(doc => {
//             if (doc.exists) //User exists 
//             {
//                 //Update
//                 let updateDoc = db.collection('users').doc(request.body.email).set(
//                     {
//                         "email" : request.body.email,
//                         "name" : request.body.name,
//                         "surname" : request.body.surname,
//                         "title" : request.body.title,
//                         "fd" : JSON.parse(request.body.fd),
//                         "active" : JSON.parse(request.body.active)
//                     })
//                 .then(ref => {
//                     console.log('Updated: ', request.body.email);
//                     response.end(JSON.stringify(
//                         {
//                             "status" : "Success"
//                         }));
//                 });
//             } 
//             else //User does not exist
//             {
//                 response.end(JSON.stringify(
//                     {
//                         "status" : "Failure",
//                         "message" : "Specified user does not exist"
//                     }
//                 ));
//                 return; //Stop as user does not exist 
//             }
//         })
//         .catch(err => {
//             response.end(JSON.stringify(
//                 {
//                     "status" : "Failure",
//                     "message" : "Document could not be retrieved"
//                 }
//             ));
//             return;
//         });
// });

exports.retrieveUser = function retrieveUser(request,response){
    if(request.body.email == undefined || request.body.email.length < 1)
    {
        response.end(JSON.stringify(
            {
                "status" : "Failure",
                "message" : "'email' field was not specified"
            }
        ));
        return; //Stop update operation as information provided was not sufficient
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
// app.post('/retrieveUser', function (request, response)
// {
//     if(request.body.email == undefined || request.body.email.length < 1)
//     {
//         response.end(JSON.stringify(
//             {
//                 "status" : "Failure",
//                 "message" : "'email' field was not specified"
//             }
//         ));
//         return; //Stop update operation as information provided was not sufficient
//     }

//     //Check if user exists
//     var userRef = db.collection('users').doc(request.body.email);
//     var getDoc = userRef.get()
//         .then(doc => {
//             if (doc.exists) //User exists 
//             {
//                 response.end(JSON.stringify(
//                     {
//                         "status" : "Success",
//                         "email" : doc.get("email"),
//                         "name" : doc.get("name"),
//                         "surname" : doc.get("surname"),
//                         "title" : doc.get("title"),
//                         "fd" : doc.get("fd")
//                     }
//                 ));
//             } 
//             else //User does not exist
//             {
//                 response.end(JSON.stringify(
//                     {
//                         "status" : "Failure",
//                         "message" : "Specified user does not exist"
//                     }
//                 ));
//                 return; //Stop as user does not exist 
//             }
//         })
//         .catch(err => {
//             response.end(JSON.stringify(
//                 {
//                     "status" : "Failure",
//                     "message" : "Document could not be retrieved"
//                 }
//             ));
//             return;
//         });
// });

//Run server
// var server = app.listen(8081, function () 
// {
//    var host = server.address().address
//    var port = server.address().port
//    console.log("Listening at http://%s:%s", host, port)
// });

/** 
 * @description: Function that adds a person to an event
 * @param eventId: The eventId toidentify event
 * @param location: The location of the venue
 * @param startTime: When the event starts
 * @param endTime: When the event stops
 * @param attendeeOTPpairs: JSON object array containg emails and their respective OTP
**/
exports.addEvent = function addEvent(request,response) {
    if(request.body.eventId == undefined || request.body.eventId.length < 1)
    {
        response.end(JSON.stringify(
            {
                "status" : "Failure",
                "message" : "'eventId' field was not specified"
            }
        ));
        return; //Stop add Event operation as information provided was not sufficient
    }

    if(request.body.location == undefined || request.body.location < 1)
    {
        response.end(JSON.stringify(
            {
                "status" : "Failure",
                "message" : "'location' field was not specified"
            }
        ));
        return; //Stop add Event operation as information provided was not sufficient
    }

    if(request.body.startTime == undefined || request.body.startTime < 1)
    {
        response.end(JSON.stringify(
            {
                "status" : "Failure",
                "message" : "'startTime' field was not specified"
            }
        ));
        return; //Stop add Event operation as information provided was not sufficient
    }

    if(request.body.endTime == undefined || request.body.endTime < 1)
    {
        response.end(JSON.stringify(
            {
                "status" : "Failure",
                "message" : "'endTime' field was not specified"
            }
        ));
        return; //Stop add Event operation as information provided was not sufficient
    }

    if(request.body.attendeeOTPpairs == undefined || request.body.attendeeOTPpairs.length < 1)
    {
        response.end(JSON.stringify(
            {
                "status" : "Failure",
                "message" : "'attendeeOTPpairs' field was not specified"
            }
        ));
        return; //Stop add Event operation as information provided was not sufficient
    }

    //Check if event exists
    var eventsRef = db.collection('events').doc(request.body.eventId);
    var getDoc = eventsRef.get()
        .then(doc => {
            if (doc.exists) //Event exists 
            {
                response.end(JSON.stringify(
                    {
                        "status" : "Failure",
                        "message" : "Specified event already exists!"
                    }
                ));
                return; //Stop as event already exists
            } 
            else //Event does not exist
            {
                //Create DB event
                let updateDoc = db.collection('events').doc(request.body.eventId).add(
                    {
                        "room" : doc.room,
                        "startTime" : doc.startTime,
                        "endTime" : doc.endTime,
                        "attendees" : doc.attendeeOTPpairs
                    })
                .then(ref => {
                    console.log('Added Event: ' + request.body.eventId);
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
 * @description: Function that adds a person to an event
 * @param eventId: The eventId toidentify event
 * @param email: Email to add to the event
 * @param otp: The OTP generated to allow access to the room
**/
exports.addAttendee = function addAttendee(request,response) {
    if(request.body.eventId == undefined || request.body.eventId.length < 1)
    {
        response.end(JSON.stringify(
            {
                "status" : "Failure",
                "message" : "'eventId' field was not specified"
            }
        ));
        return; //Stop add OTP operation as information provided was not sufficient
    }

    if(request.body.otp == undefined || request.body.otp < 1)
    {
        response.end(JSON.stringify(
            {
                "status" : "Failure",
                "message" : "'otp' field was not specified"
            }
        ));
        return; //Stop add OTP operation as information provided was not sufficient
    }

    if(request.body.email == undefined || request.body.email.length < 1)
    {
        response.end(JSON.stringify(
            {
                "status" : "Failure",
                "message" : "'email' field was not specified"
            }
        ));
        return; //Stop add OTP operation as information provided was not sufficient
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

                doc.attendees.forEach(attendee => {
                    //Check if email already exists
                    if(attendee.email == request.body.email)
                    {
                        response.end(JSON.stringify(
                            {
                                "status" : "Failure",
                                "message" : "Provided email is already registered in event!"
                            }
                        ));
                        return; //Stop as the email was already part of the event
                    }

                    emails.push(attendee.email);
                    otps.push(attendee.otp);
                });

                //Add the OTP to the event
                emails.push(request.body.email);
                otps.push(request.body.otp);
            

                //Save updated event to DB
                let updateDoc = db.collection('events').doc(request.body.eventId).set(
                    {
                        "room" : doc.room,
                        "startTime" : doc.startTime,
                        "endTime" : doc.endTime,
                        "attendees" : 
                                    { 
                                        emails,
                                        otps
                                    }
                    })
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
    if(request.body.eventId == undefined || request.body.eventId.length < 1)
    {
        response.end(JSON.stringify(
            {
                "status" : "Failure",
                "message" : "'eventId' field was not specified"
            }
        ));
        return; //Stop retreive operation as information provided was not sufficient
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

                    emails.push(attendee.email);
                    otps.push(attendee.otp);
            }

            response.end(JSON.stringify(
                {
                    "status" : "Failure",
                    "message" : "Given OTP was incorrect"
                }
            ));
            return;
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