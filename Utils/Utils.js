"use strict";
/**
 * Filename: Utils.ts
 * Version: V1.0
 * Author: JJ Goschen
 * Project name: A-Recognition (Advance)
 * Organization: Singularity
 * Funtional description: Provides functionality that does not belong to a specific component
*/
exports.__esModule = true;
/**
* Filters an array/single object, if no options are passed through then deafault event filtering takes place and this will throw an error on non event objects
* @param {any} data The array or single object to filter
* @param {any} options Specifies what keys should be passed on to the new object
* @returns {Array<Object> | Object }
*/
function filter(data, options) {
    var dataArr = [];
    if (options == null || options == undefined) {
        data.forEach(function (el) {
            var filteredObject = {
                id: el.id,
                status: el.status,
                created: el.created,
                creator: el.creator,
                organizer: el.organizer,
                title: el.summary
            };
            if (el.location != null && el.location != undefined)
                filteredObject["location"] = el.location;
            else
                filteredObject["location"] = "No locations specified";
            if (el.start.dateTime != null && el.start.dateTime != undefined) { //DateTime format provided
                filteredObject["startDate"] = el.start.dateTime.substring(0, el.start.dateTime.indexOf("T"));
                filteredObject["startTime"] = el.start.dateTime.substring(el.start.dateTime.indexOf("T") + 1, el.start.dateTime.length);
            }
            else { // No Time provided, whole day event?
                filteredObject["startDate"] = el.start.date;
            }
            if (el.end.dateTime != null && el.end.dateTime != undefined) { //DateTime format provided
                filteredObject["endDate"] = el.end.dateTime.substring(0, el.end.dateTime.indexOf("T"));
                filteredObject["endTime"] = el.end.dateTime.substring(el.end.dateTime.indexOf("T") + 1, el.end.dateTime.length);
            }
            else { // No Time provided, whole day event?
                filteredObject["endDate"] = el.end.date;
            }
            if (el.description != null && el.description != undefined)
                filteredObject["description"] = el.description;
            else
                filteredObject["description"] = "No description";
            filteredObject["attendees"] = [];
            if (el.attendees != null && el.attendees != undefined && el.attendees.length != 0) {
                el.attendees.forEach(function (attendee) {
                    filteredObject["attendees"].push(attendee.email);
                });
            }
            dataArr.push(filteredObject);
        });
    }
    else { // Custom filter options
        if (Array.isArray(data)) { // Passed an array of objects
            data.forEach(function (el) {
                var filteredObject = {};
                for (var key in options) {
                    if (el.hasOwnProperty(key)) {
                        if (key == "attendees") {
                            filteredObject["attendees"] = [];
                            el.attendees.forEach(function (attendee) {
                                filteredObject["attendees"].push(attendee.email);
                            });
                        }
                        else if (key == "start") {
                            if (el.start.dateTime != null && el.start.dateTime != undefined) { //DateTime format provided
                                filteredObject["startDate"] = el.start.dateTime.substring(0, el.start.dateTime.indexOf("T"));
                                filteredObject["startTime"] = el.start.dateTime.substring(el.start.dateTime.indexOf("T") + 1, el.start.dateTime.length);
                            }
                            else { // No Time provided, whole day event?
                                filteredObject["startDate"] = el.start.date;
                            }
                        }
                        else if (key == "end") {
                            if (el.end.dateTime != null && el.end.dateTime != undefined) { //DateTime format provided
                                filteredObject["endDate"] = el.end.dateTime.substring(0, el.end.dateTime.indexOf("T"));
                                filteredObject["endTime"] = el.end.dateTime.substring(el.end.dateTime.indexOf("T") + 1, el.end.dateTime.length);
                            }
                            else { // No Time provided, whole day event?
                                filteredObject["endDate"] = el.end.date;
                            }
                        }
                        else
                            filteredObject[key] = el[key];
                    }
                    else
                        filteredObject[key] = null;
                }
                dataArr.push(filteredObject);
            });
        }
        else {
            var filteredObject = {};
            for (var key in options) {
                if (data.hasOwnProperty(key))
                    filteredObject[key] = data[key];
                else
                    filteredObject[key] = null;
            }
            return filteredObject;
        }
    }
    return dataArr;
}
exports.filter = filter;
/**
 * Checks if an object is present in an array based on some key, if a non/empty array is passed in then false is returned.
 * @param {string} value The value of the key to compare against
 * @param {any} array The array of objects to search through
 * @param {string} key The key field of each object that is compared against 'value'
 * @returns {true | false}
 */
function inArray(value, array, key) {
    if (key === void 0) { key = "normalArray"; }
    if (!Array.isArray(array) || array.length == 0)
        return false;
    for (var i = 0; i < array.length; i++) {
        var obj = array[i];
        if (key === "normalArray") { //Dealing with a normal array, not an array of objects
            if (obj === value)
                return true;
        }
        else {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] == value)
                    return true;
            }
        }
    }
    return false;
}
exports.inArray = inArray;
