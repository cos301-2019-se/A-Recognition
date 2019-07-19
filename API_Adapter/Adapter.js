"use strict";
exports.__esModule = true;
/**
 * Filename: Adapter.ts
 * Version: V1.2
 * Author: JJ Goschen
 * Project name: A-Recognition (Advance)
 * Organization: Singularity
 * Funtional description: Provides an adapter that allows communication with various calendar API's
*/
var adaptees = ["google", "microsoft"];
var GoogleAdaptee_1 = require("./GoogleAdaptee");
var MicrosoftAdaptee_1 = require("./MicrosoftAdaptee");
var Utils = require("../Utils/Utils");
/**
 * Adapter responsible for passing on requests from client to respective adaptee
 * @var {googleAdaptee} adaptee the target adaptee for booking information
 */
var Adapter = /** @class */ (function () {
    function Adapter() {
        this.adaptee = new GoogleAdaptee_1.GoogleAdaptee();
        this.currentAdapteeIndex = 0;
    }
    /**
     * changes the target adaptee for the adapter
     * @param {string | null} target the name of the target platform eg. Microsoft/Google, if undefined then switch to the next available adaptee
     */
    Adapter.prototype.changeAdaptee = function (target) {
        if (target === void 0) { target = null; }
        if (target == null || target == undefined) { //target undefined, choose next available adaptee
            target = adaptees[++this.currentAdapteeIndex % adaptees.length];
            this.currentAdapteeIndex = this.currentAdapteeIndex % adaptees.length;
        }
        target = target.toLowerCase();
        switch (target) {
            case "google":
                this.adaptee = new GoogleAdaptee_1.GoogleAdaptee();
                this.currentAdapteeIndex = 0;
                break;
            case "microsoft":
                this.adaptee = new MicrosoftAdaptee_1.MicrosoftAdaptee();
                this.currentAdapteeIndex = 1;
                break;
            default:
                this.adaptee = new GoogleAdaptee_1.GoogleAdaptee();
                this.currentAdapteeIndex = 0;
                break;
        }
        return target;
    };
    /**
     * retrieves the scheduled events of a specific user or returns a null object if there are none
     * @param {string | number} identifier the user identifier of choice
     * @param {boolean} filter whether the result should be filtered into a simpler JSON object
     * @param {any} options if left out then standard filtering is applied otherwise options specifies what keys should be passed on to the new object
     * @returns {Object[] | string }
     */
    Adapter.prototype.retrieveUserEvents = function (identifier, filter, options, resultSize, endTime) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.adaptee.getUserEvents(identifier, resultSize, endTime).then(function (bookings) {
                if (!filter)
                    resolve(bookings);
                else
                    resolve(Utils.filter(bookings, options));
            })["catch"](function (err) {
                //Most probably no events, but possibly something else
                reject(err);
            });
        });
    };
    /**
     * retrieves the scheduled events of a specific user or returns a null object if there are none
     */
    Adapter.prototype.retrieveUserCalendars = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.adaptee.getUserCalendars().then(function (calendarList) {
                resolve(calendarList);
            })["catch"](function (err) {
                console.log(err);
                reject({});
            });
        });
    };
    return Adapter;
}());
exports.Adapter = Adapter;
