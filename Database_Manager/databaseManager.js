//Firbase setup
var admin = require("firebase-admin");
var serviceAccount = require("./credentials.json");
admin.initializeApp(
    {
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://arecognition-48c05.firebaseio.com"
    });
let db = admin.firestore();

//Express setup
var express = require('express');
var app = express();

//Endpoint for retrieving known email-facial data pairs (To be used for facial recognition)
app.get('/getKnownFaceEncodings', function (req, res) {
    //Get known face encodings from the DB with their respective email addresses
    users = db.collection("Users").get()
        .then(userSet => {
        var emails = [];
        var faceData = [];

        userSet.forEach(user => {
            emails.push(user.get("Email"));

            //Since the data is saved in such a shit way we first strip the unnessesasary objects
            var facialData = user.get("image_vector");
            faceData.push(facialData[0].encoding);

            //console.log("Retrieved " + user.id);
            //console.log(facialData[0].encoding);
        });
        
        //Return JSON object with two arrays; One with faces and the other with emails to match
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(
            {
                "emails" : emails,
                "fd" : faceData
            }
        ));
    });
});

//Run server
var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Listening at http://%s:%s", host, port)
});