"use strict";
exports.__esModule = true;
var Adapter_1 = require("./Adapter");
var Utils = require("../Utils/Utils");
var adapter = new Adapter_1.Adapter();
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
function getCalendarEvents(calendarId, filter, options, size, endTime) {
    if (calendarId === void 0) { calendarId = "primary"; }
    if (filter === void 0) { filter = false; }
    if (options === void 0) { options = null; }
    if (size === void 0) { size = 4; }
    if (endTime === void 0) { endTime = ""; }
    return adapter.retrieveUserEvents(calendarId, filter, options, size, endTime);
}
exports.getCalendarEvents = getCalendarEvents;
function getCalendars() {
    return adapter.retrieveUserCalendars();
}
exports.getCalendars = getCalendars;
function getEventAttendees(event, options) {
    if (options === void 0) { options = null; }
    if (options != null)
        return Utils.filter(event.attendees, options);
    else
        return event.attendees;
}
exports.getEventAttendees = getEventAttendees;
function changeAdaptee(target) {
    if (target === void 0) { target = null; }
    adapter.changeAdaptee(target);
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
