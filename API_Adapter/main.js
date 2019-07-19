"use strict";
exports.__esModule = true;
/**
 * Filename: main.ts
 * Version: V1.0
 * Author: JJ Goschen
 * Project name: A-Recognition (Advance)
 * Organization: Singularity
 * Funtional description: Provides a wrapper around the adpater for event functionality
*/
var Adapter_1 = require("./Adapter");
var Utils = require("../Utils/Utils");
var adapter = new Adapter_1.Adapter();
/**
* Should not be used in current state
* @returns {Promise<any>}
*/
function getAllEvents() {
    return adapter.retrieveUserCalendars().then(function (calendarList) {
        var eventBookings = [];
        calendarList.forEach(function (calendar) {
            eventBookings.push(adapter.retrieveUserEvents(calendar.calendarId, true, null, 2, ""));
        });
        return Promise.all(eventBookings);
    })["catch"](function (err) {
        console.log(err);
    });
}
exports.getAllEvents = getAllEvents;
/**
* Returns a list of events for a specific calendarId
* @param {string} calendarId The calendar identifier, typically 'primary'
* @param {boolean} filter Indicates whether you want the events to be filtered
* @param {Object} options What keys are to be returned after filtering, eg {foo : true}
* @param {number} size How many events to return, -1 will return maximum
* @param {string} endTime ISO string of the time after which no more events should be collected
* @returns {Promise<any>}
*/
function getCalendarEvents(calendarId, filter, options, size, endTime) {
    if (calendarId === void 0) { calendarId = "primary"; }
    if (filter === void 0) { filter = false; }
    if (options === void 0) { options = null; }
    if (size === void 0) { size = 4; }
    if (endTime === void 0) { endTime = ""; }
    return adapter.retrieveUserEvents(calendarId, filter, options, size, endTime);
}
exports.getCalendarEvents = getCalendarEvents;
/**
* Returns a list of calendars associated with the current user credentials
* @returns {Promise<any>}
*/
function getCalendars() {
    return adapter.retrieveUserCalendars();
}
exports.getCalendars = getCalendars;
/**
* Returns an array of event attendees given an event object
* @param {any} event The event to pull from
* @param {any} options The filter that should be applied to the attendees
* @returns {Promise<any>}
*/
function getEventAttendees(event, options) {
    if (options === void 0) { options = null; }
    if (options != null)
        return Utils.filter(event.attendees, options);
    else
        return event.attendees;
}
exports.getEventAttendees = getEventAttendees;
/**
* Changes the current target API
* @param {string} target The target adaptee eg. google,microsoft
* @returns {string}
*/
function changeAdaptee(target) {
    if (target === void 0) { target = null; }
    return adapter.changeAdaptee(target);
}
exports.changeAdaptee = changeAdaptee;
function run() {
    var currentEvents = [];
    setInterval(function () {
        getCalendarEvents().then(function (events) {
            events.forEach(function (event) {
                if (!Utils.inArray(event.id, currentEvents, "id"))
                    currentEvents.push(Utils.filter(event, { id: true, summary: true, location: true, description: true }));
                else
                    console.log(currentEvents.indexOf(event));
            });
            console.log("Current events:\n", currentEvents);
        })["catch"](function (err) {
            console.log(err);
        });
    }, 10000);
}
exports.run = run;
/**
* Returns a list of events for a specific calendarId
* @param {string} calendarId The calendar identifier, typically 'primary'
* @param {boolean} filter Indicates whether you want the events to be filtered
* @param {Object} options What keys are to be returned after filtering, eg {foo : true}
* @param {number} size How many events to return, -1 will return maximum
* @param {string} endTime ISO string of the time after which no more events should be collected
* @returns {Promise<any>}
*/
function getEvents(calendarId, filter, options, size, endTime) {
    if (calendarId === void 0) { calendarId = "primary"; }
    if (filter === void 0) { filter = false; }
    if (options === void 0) { options = null; }
    if (size === void 0) { size = 4; }
    if (endTime === void 0) { endTime = ""; }
    var currentEvents = [];
    return new Promise(function (resolve, reject) {
        getCalendarEvents(calendarId, filter, options, size, endTime).then(function (events) {
            events.forEach(function (event) {
                currentEvents.push(event);
            });
            resolve(currentEvents);
        })["catch"](function (err) {
            reject(err);
        });
    });
}
exports.getEvents = getEvents;
