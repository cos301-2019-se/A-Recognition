# Database Manager
## A-Recognition Access Control

### All function Responses in general
All functions returns a JSON response, which all have a 'status' field that is used to indicate the success or failure of a call. 

### All Failure responses
In addition to the status field, all failure responses provides a 'message' field to provide information about the error that occured. 
Example:
```
{
    "status" : "Failure",
    "message" : "Some description of the error"
}
```
---
### DB Functions related to users

#### retrieveEncodings
This function returns all active registered users as a JSON object containing email-facialData pairs in the form of two paralel arrays.
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

#### register
Function used to add users to the system. The request containing the details 
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

#### update
Fucntion for updating a user's details. The request should contain all user details.

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

#### retrieveUser
Function that retrieves a user's details based on provided email. The request:

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

#### deleteUser
Function that permanently removes a user based on their email. The request:

Example:
```
{
    "email" : "email@some.domain"
}
```
---
### Event related endpoints

#### addEvent
Function used to create a new event in the DB. The request:
Example:
```
{
    "eventId"   : "yourEvent ID",
    "summary"   : "Your summary",
    "location"  : "Your location",
    "startTime" : "01/01/2000 00:00",
    "endTime"   : "02/01/2000 00:00",
    "attendeeOTPpairs" : [
        {
            "email" : "email@some.domain",
            "otp" : "123456"
        },
        {
            "email" : "other@some.domain",
            "otp" : "654321"
        }
    ],
    "eventOTP"  : ""
}
```

#### retrieveEvent
Function that returns a specific event based on the event ID. The request:

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

#### retrieveEventIds
Function that returns a list of eventIds of all stored events

Example response:
```
{ 
    eventIds: [ 
        '0bfasnk59cko11i02u3cmpkknp',
        '16sp7s0nd392tgg6hb5d1drcm2',
        '1jnhovv1ngb8ppq6v4tejh9js0',
        '228p0hkrct9me3l5ovmqmqqu0k'
    ]
}
```

#### updateEvent
Function to allow the update of a existing event. The request:

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

#### deleteEvent
Function to allow deletion of a specific event. The request:

Example:
```
{
    "eventId" : "38173"
}
```

#### addAttendee
Allows the adding of an extra attendee (email + otp pair) to an existing event, to allow them access to room booked for the event. The request:

Example:
```
{
    "eventId" : "38173",
    "email" : "newly@addedEmail",
    "otp" : "22334"
}
```

#### getEventAttendees
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
            "otp" : "12345"
        },
        {
            "email" : "attendee2@email.here",
            "otp" : "67890"
        }
    ]
}
```
---