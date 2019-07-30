# Database Management API
## A-Recognition Access Control
### Endpoints

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

Success response:

```
{
    "status" : "Success"
}
```

Failure response:
```
{
    "status" : "Failure",
    "message" : "some description of the error"
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

Success response:
```
{
    "status" : "Success"
}
```

Failure response:
```
{
    "status" : "Failure",
    "message" : "some description of the error"
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

Failure response:
```
{
    "status" : "Failure",
    "message" : "some description of the error"
}
```

---