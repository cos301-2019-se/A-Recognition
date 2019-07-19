"use strict";
exports.__esModule = true;
/**
 * Filename: main.ts
 * Version: V1.0
 * Author: JJ Goschen
 * Project name: A-Recognition (Advance)
 * Organization: Singularity
 * Funtional description: Provides an interface used to integrate capabilities of other components
*/
var Adapter = require("../API_Adapter/main");
var Utils = require("../Utils/Utils");
var python_shell_1 = require("python-shell"); //npm install python-shell
var CHECK_BOOKINGS_HOURS_AHEAD_OF_TIME = 1;
var MINUTES_BEFORE_EVENT_START_THAT_ENTRANCE_IS_ALLOWED = 15;
/**
 * Returns a list of user emails for all users that have bookings on the current day
 * @returns {Promise<Array<string> | null>} an array of emails if there are events for the current day or a null object if there is none or an error occured.
 */
function getUsersFromDaysEvents() {
    return new Promise(function (resolve, reject) {
        Adapter.getEvents().then(function (events) {
            var attendeesBookedToday = [];
            if (Array.isArray(events)) {
                events.forEach(function (event) {
                    event["attendees"].forEach(function (person) {
                        if (!Utils.inArray(person.email, attendeesBookedToday))
                            attendeesBookedToday.push(person.email);
                    });
                });
            }
            else {
                events["attendees"].forEach(function (person) {
                    if (!Utils.inArray(person.email, attendeesBookedToday))
                        attendeesBookedToday.push(person.email);
                });
            }
            resolve(attendeesBookedToday);
        })["catch"](function (err) {
            reject(null);
        });
    });
}
exports.getUsersFromDaysEvents = getUsersFromDaysEvents;
/**
* Validates that the given email at the given room has a booking at the current time
* @param {string} email The array or single object to filter
* @param {string} room Specifies what keys should be passed on to the new object
* @returns {Promise<any>}
*/
function validateUserHasBooking(email, room) {
    return new Promise(function (resolve, reject) {
        var endTime = new Date();
        endTime.setHours(endTime.getHours() + CHECK_BOOKINGS_HOURS_AHEAD_OF_TIME);
        Adapter.getEvents("primary", true, { attendees: true, location: true, start: true }, 3, endTime.toISOString()).then(function (closestEvents) {
            for (var i = 0; i < closestEvents.length; i++) {
                var event_1 = closestEvents[i];
                var timeNow = new Date();
                var entranceAllowedToEvent = new Date(event_1.start.dateTime);
                entranceAllowedToEvent.setMinutes(entranceAllowedToEvent.getMinutes() - MINUTES_BEFORE_EVENT_START_THAT_ENTRANCE_IS_ALLOWED);
                if (room == event_1.location) {
                    var message = "";
                    if (Utils.inArray(email, event_1.attendees))
                        message += "User has a booking in that room";
                    else
                        message += "User does not have a booking for that room";
                    if (timeNow.getTime() > entranceAllowedToEvent.getTime())
                        message += ",Room is allowed access now";
                    else
                        message += ",Room is not allowed access yet";
                    resolve(message);
                }
            }
            resolve("There is no booking for that room now");
        })["catch"](function (err) {
            reject(err);
        });
    });
}
exports.validateUserHasBooking = validateUserHasBooking;
/**
* Fetches the email addresses of current employees
* @returns {Promise<any>}
*/
function getEmployeeEmails() {
    return new Promise(function (resolve, reject) {
        var pyshell = new python_shell_1.PythonShell("test.py");
        pyshell.on('message', function (message) {
            // received a message sent from the Python script (a simple "print" statement)
            //Why does python return a string instead of an array
            var array = message.split(",");
            array = array.map(function (el) { return el.replace(/'|,/g, ""); });
            array = array.map(function (el) { return el.replace("[", ""); });
            array = array.map(function (el) { return el.replace("]", ""); });
            array = array.map(function (el) { return el.trim(); });
            resolve(array);
            //DATA CONTAINS THE EMAILS
        });
        // end the input stream and allow the process to exit
        pyshell.end(function (err) {
            if (err) {
                reject(err);
            }
            ;
        });
    });
}
exports.getEmployeeEmails = getEmployeeEmails;
/**
* Validates if the provided email belongs to a registered employee
* @param {string} email The array or single object to filter
* @returns {Promise<boolean>}
*/
function isEmployee(email) {
    return new Promise(function (resolve, reject) {
        getEmployeeEmails().then(function (employees) {
            //console.log(JSON.parse(employees));
            resolve(Utils.inArray(email, employees));
        })["catch"](function (err) {
            console.log(err);
            reject(false);
        });
    });
}
exports.isEmployee = isEmployee;
/**
* Polls events and checks if a user assinged to an event is a guest, sending them an OTP
* @returns {void}
*/
function checkBookingsForGuests() {
    var markedAsGuest = [];
    setInterval(function () {
        getEmployeeEmails().then(function (emails) {
            Adapter.getEvents("primary", true, { location: true, start: true, attendees: true }).then(function (events) {
                events.forEach(function (event) {
                    event.attendees.forEach(function (attendee) {
                        if (!Utils.inArray(attendee, markedAsGuest) && !Utils.inArray(attendee, emails)) {
                            markedAsGuest.push(attendee);
                            var notifyViaOTP = {
                                guest: attendee,
                                location: event.location,
                                startDate: event.startDate,
                                startTime: event.startTime
                            };
                            console.log("Sending OTP", notifyViaOTP);
                        }
                    });
                });
            })["catch"](function (err) {
                console.log(err);
            });
        })["catch"](function (err) {
            console.log(err);
        });
    }, 25000);
}
exports.checkBookingsForGuests = checkBookingsForGuests;
