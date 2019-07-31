/** 
 * Filename: message.js
 * Version: V1.0
 * Author: AM Rossi
 * Project Name: A-Recognition (Advance)
 * Organization: Singularity
 * Funtional Description: Used to hold pre-prepared messages that will be send via the notification system
*/

//const otpGen = require('./notification.js');

const roomName = "Rome";

exports.unauthMessage = {
    from: "arecognition.bot@gmail.com",
    to: "rossimichele04@gmail.com",
    subject: "Unauthorized access attempted at room *insert room name*",
    generateTextFromHTML: true,
    html: 
    "Unauthorized access was attempted at room " + roomName + " at " + Date.now()
}

exports.otpClient = {
    from: "arecognition.bot@gmail.com",
    to: "rossimichele04@gmail.com, alessio@fasmco.com",  
    subject: "OTP for meeting room " + roomName,
    generateTextFromHTML: true,
    text: "Your OTP to gain entrance to the Advance HQ as well as the specified meeting room is: " 
}