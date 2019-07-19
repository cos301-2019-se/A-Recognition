/** 
 * Filename: notification.js
 * Version: V1.0
 * Author: AM Rossi
 * Project name: A-Recognition (Advance)
 * Organization: Singularity
 * Funtional description: A subsystem used to send notification emails in the cases of:
 *          - Unauthorized access (the /unauthorized endpoint)
 *          - OTP generation for clients (the /otp endpoint)
*/

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const messages = require('./messages');
const http = require('http');


// defining the Express app
const app = express();

// let's use it
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// Default endpoint to generate an otp with no emails being sent
app.get('/', (req, res) => {
  res.send(generateOTP().otp);
});


// starting the server
app.listen(3000, () => {
  console.log('listening on port 3000');
});

// Determine a way to clean up the details about the email sender as well as determing what timeframe variables
// will be used. Possibly do only current time in the form of HH:MM
// Could also set up automated manner to send email for OTP x hours before booking time of start

/**
 * A function that will send the actual email to the relevant recipient pertaining to the endpoint used.
 * 
 * @param {A string token that is passed to determine the action of the notification to be sent, 
 * determined by the relevant endpoint used} emailToken 
 */
exports.sendEmail =  async function sendEmail(emailToken, emailDetails, generatedOtp) {
    /**
     * A simple variable array that will hold the relevant details per message that will determine the type
     * of notification to send and whom to send it to.
     * Limited currently to Unauthorized Access and OTP generation
     */

    
    var mailOptions = {};

    /**
     * The oauth2client variable will hold details pertaining to authorization using a 
     * Gmail account to send emails.
     * It takes in three variables when being created, namely:
     *          - Client ID
     *          - Client Secret
     *          - A redirecting URl
     */

    const oauth2client = new OAuth2(
        "680276265540-jr5q5k0kfvp7elsav0jfdf9621c3etai.apps.googleusercontent.com", 
        "S-Ka9zoEMPRvDk8ROsyvgYdn",
        "https://developers.google.com/oauthplayground"
    )

    oauth2client.setCredentials({
        refresh_token: "1/zghb1ONcSV5Pg742IoWUQBkzduMCYQoRMl8RH06hWCE"
    });


    //const tokens = await oauth2client.refreshAccessToken();

    const tokens = await oauth2client.refreshAccessToken();
    
    const accessToken = tokens.credentials.access_token;

    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "arecognition.bot@gmail.com",
            clientId: "680276265540-jr5q5k0kfvp7elsav0jfdf9621c3etai.apps.googleusercontent.com",
            clientSecret: "S-Ka9zoEMPRvDk8ROsyvgYdn",
            refreshToken: "1/zghb1ONcSV5Pg742IoWUQBkzduMCYQoRMl8RH06hWCE",
            accessToken: accessToken
        }
    });

    // Room names will have to be retrieved from the adapter class at the moment, will be retrieved from the 
    // Database at a later stage.

    /**
     * A default test endpoint used when determing the status of emails being sent.
     */
        if(emailToken == "test") {
            mailOptions.from = "arecognition.bot@gmail.com",
            mailOptions.to = "rossimichele04@gmail.com",
            mailOptions.subject = "Testing subject",
            mailOptions.generateTextFromHTML = true;
            mailOptions.html = "Notification alert"
        }
        else if(emailToken == "unauth") {
            mailOptions = messages.unauthMessage;
            
        }
        else if(emailToken == "otp") 
        {
            /**
             * Will tidy up and sort out files etc to make code look cleaner.
             */
            try {
            mailOptions = messages.otpClient;
            mailOptions.to = emailDetails.guest;
            mailOptions.subject = "OTP delivery for meeting room " + emailDetails.location;
            mailOptions.html =  "   Goodday fellow Advancer! <br>" 
                                +   "This is to notify you that your meeting on the "
                                +   emailDetails.startDate
                                +   " will start at: " + emailDetails.startTime
                                +   " in room " + emailDetails.location 
                                +   ".<br> It will require the following OTP to gain access: " + generatedOtp;
            } catch(e) {
                console.log(e);
            }
        }

    smtpTransport.sendMail(mailOptions, (error, response) => {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
   });}

   otpValue = {
       "otp": "",
       "timeCreated": ""
   };
   /**
    *   A Function used to create and generate a OTP that will be used for guest clients.
    *   The function itself does not take in any parameters but will return an OTP of current length
    *   of 6 digits and append it to the OTPValue JSON variable under the OTP key : value pair.
    *
    *   The function clears the otp value after each generation to allow for different pins to be generated
    *   after every call.
    */

    exports.generateOTP = function generateOTP() {
        let otpTemp = {
            "otp": "",
            "timeCreated": ""
        };
        var digits = '0123456789'; 
        let OTP = ''; 
        for (let i = 0; i < 6; i++ ) { 
            OTP += digits[Math.floor(Math.random() * 10)]; 
        }
        otpTemp.timeCreated = Date.now();
        otpTemp.otp = OTP;
        OTP = '';
        return otpTemp;
    }


    app.get('/email', (req, res) => {
        console.log('OTP value generated: ' + otpValue.otp);
        console.log('testing');
        sendEmail('otp');
})  

    /*
    *   
    *   The OTP endpoint will be used to generate an OTP for the relevant email address, and the 
    *   send email function will send the OTP to the relevant recipient.
    *
    *
    */
    app.get('/otp', (req, res) => {
        const notificationData = req.body;

        console.log("Guest name: " + notificationData.guest 
                    + " Location: " + notificationData.location 
                    + " Start Date: " + notificationData.startDate 
                    + "Start Time: " + notificationData.startTime);
        
        const genOtp = generateOTP().otp;
        console.log("Generated OTP: " + genOtp);
        res.send(generateOTP());
        sendEmail("otp", notificationData, genOtp);
    })

    /**
     * The unauthorized endpoint will be used in cases where the facial recognition detects
     * a person attempting to gain entrance to a room they were not added to or any unauthorized
     * access being attempted. In this case, an admin will be notified to the behaviour.
     */
    app.get('/unauthorized', (req, res) => {
        res.send(messages.unauthMessage);
        sendEmail('unauth');
    })
