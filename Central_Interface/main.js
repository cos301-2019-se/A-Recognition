"use strict";
exports.__esModule = true;
var Adapter = require("../API_Adapter/main");
var Utils = require("../Utils/Utils");
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
// getUsersFromDaysEvents().then( users =>{
//     console.log(users); 
// });
validateUserHasBooking("jarrodgoschen1@gmail.com", "Room 7").then(function (msg) {
    console.log(msg);
    validateUserHasBooking("jarrodgoschen@gmail.com", "Room 7").then(function (msg) {
        console.log(msg);
        validateUserHasBooking("mcfaddenr.ebb@gmail.com", "Room 99 @ Khaosan, 99 Samsen 4 Alley, Khwaeng Ban Phan Thom, Khet Phra Nakhon, Krung Thep Maha Nakhon 10200, Thailand").then(function (msg) {
            console.log(msg);
            validateUserHasBooking("mcfaddenr.ebb@gmail.com", "room 7").then(function (msg) {
                console.log(msg);
            });
        });
    });
});
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
                        message += ",user is allowed access now";
                    else
                        message += ",user is not allowed access yet";
                    resolve(message);
                }
            }
            resolve("There is no booking for that room now");
        })["catch"](function (err) {
            console.log(err);
        });
    });
}
exports.validateUserHasBooking = validateUserHasBooking;
