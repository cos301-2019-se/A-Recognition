# Database Management API
## A-Recognition Access Control

### API Responses in general
All responses have a 'status' field that is used to indicate the success or failure
of a request. 

### API Failure responses
In addition to the status field, all failure responses provides a 'message' field to provide information about the error that occured. 
Example:
```
{
    "status" : "Failure",
    "message" : "Some description of the error"
}
```

### User related endpoints

#### /retrieveEncodings
This endpoint returns all active registered users as a JSON object containing email-facialData pairs
in the form of two paralel arrays.
i.e index 0 of the "emails" array corresponds to index 0 of the "fd" (Facial data) array.

Example:
```
{
    "emails": [
        "email1@some.domain",
        "email2@some.domain",
        "email3@some.domain"
    ],
    "fd": [
        [
            -0.0893356129527092,
            0.029628077521920204,
            0.10922149568796158,
            ...
            0.03481590002775192,
            0.03250574320554733
        ],
        [
            -0.11047995835542679,
            0.1310310810804367,
            -0.04786147549748421,
            ...
            0.06657759845256805,
            0.0011006128042936325
        ],
        [
            -0.11196105182170868,
            0.028782090172171593,
            0.030501335859298706,
            ...
            0.11167395859956741,
            0.010125321336090565
        ]
    ]
}
```
---

#### /register
Endpoint used to add users to the system. The request containing the details 
should be a JSON object as follows:

Example:
```
{ 
    "email" : "email@some.domain",
    "name" : "John",
    "surname": "Doe",
    "title": "Mr",
    "fd": [123,...,456],
    "active" : false
}
```

---

#### /update
Endpoint for updating a user's details. The request should contain all user details.

Example:
```
{ 
    "email" : "email@some.domain",
    "name" : "John",
    "surname": "Doe",
    "title": "Mr",
    "fd": [123,...,456],
    "active" : true
}
```

---

#### /retrieveUser
Endpoint to retrive a user's details based on given email. The request:

Example:
```
{
    "email" : "email@some.domain"
}
```

Success response:
```
{
    "status" : "Success"
    "email" : "email@some.domain",
    "name" : "John",
    "surname": "Doe",
    "title": "Mr",
    "fd": [123,...,456]
}
```

### Event related endpoints

#### /addEvent
Enpoint to allow storing of a new event in the DB. The request:
Example:
```
{
    "eventId" : "38173",
    "location" : "Rome",
    "startTime" : "20/04/2019 15:30",
    "endTime" : "20/04/2019 16:30",
    "attendeeOTPpairs" : [
        {
            "email" : "john@some.domain",
            "otp" : "12345"
        },
        {
            "email" : "jane@some.domain",
            "otp" : "67890"
        }
    ]
}
```
#### /retrieveEvent
Endpoint the returns a specific event. The request:
Example:
```
{
    "eventId" : "eventid1234"
}
```
Returns the event in the form:
Example:
```
{
    "status": "Success",
    "location": "Italy",
    "startTime": "18:20",
    "endTime": "19:20",
    "attendeeOTPpairs": [
        {
            "email": "alice@gmail.com",
            "otp": "1234"
        },
        {
            "email": "bob@gmail.com",
            "otp": "5678"
        }
    ]
}
```

#### /updateEvent
Endpoint to allow the updating of a existing event. The request:
Example:
```
{
    "eventId" : "38173",
    "location" : "Paris",
    "startTime" : "21/04/2019 16:30",
    "endTime" : "21/04/2019 17:30",
    "attendeeOTPpairs" : [
        {
            "email" : "john@some.domain",
            "otp" : "12345"
        },
        {
            "email" : "jane@some.domain",
            "otp" : "67890"
        }
    ]
}
```
#### /deleteEvent
Endpoint to allow deletion of a specific event. The request:
Example:
```
{
    "eventId" : "38173"
}
```
#### /addAttendee
Allows the adding of an extra person (email + otp pair) to an existing event, to allow them access. The request:
Example:
```
{
    "eventId" : "38173",
    "email" : "newly@addedEmail",
    "otp" : "22334"
}
```
#### /getEventAttendees
Retrieves all email/otp pairs for a specific event. The request:
Example:
```
{
    "eventId" : "38173"
}
```
Succsess response example:
```
{
    "status" : "Succsess",
    "attendeeOTPpairs" : [
        {
            "email" : "attendee@email.here",
            "OTP" : "12345"
        },
        {
            "email" : "attendee2@email.here",
            "otp" : "67890"
        }
    ]
}
```
---