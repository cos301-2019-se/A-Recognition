/** 
 * Filename: message.js
 * Version: V1.0
 * Author: AM Rossi
 * Project Name: A-Recognition (Advance)
 * Organization: Singularity
 * Funtional Description: Used to hold pre-prepared messages that will be send via the notification system
*/

const otpGen = require('./notification.js');

const roomName = "Rome";

exports.unauthMessage = {
    from: "arecognition.bot@gmail.com",
    to: "rossimichele04@gmail.com",
    subject: "Unauthorized access attempted at room *insert room name*",
    generateTextFromHTML: true,
    html: 
    "This is testing cross file export functionality to prepare messages to send."
}

exports.otpClient = {
    from: "arecognition.bot@gmail.com",
    to: "rossimichele04@gmail.com", 
    subject: "OTP for meeting room *insert meeting room*",
    generateTextFromHTML: true,
    text: "Some text" + generateOTP().otp
}

function generateOTP() {
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

// "This is to notify you that your meeting at: <b>Insert meeting details here (time, date, room)</b> "+
// " will require the following OTP to gain access: "