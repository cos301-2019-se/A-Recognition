"use strict";
exports.__esModule = true;
var adaptees = ["google", "microsoft"];
var GoogleAdaptee_1 = require("./GoogleAdaptee");
var MicrosoftAdaptee_1 = require("./MicrosoftAdaptee");
var Utils = require("./Utils");
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
     * @param {string} target the name of the target platform eg. Microsoft/Google, if undefined then switch to the next available adaptee
     */
    Adapter.prototype.changeAdaptee = function (target) {
        if (target == null || target == undefined) //target undefined, choose next available adaptee
            target = adaptees[this.currentAdapteeIndex = (this.currentAdapteeIndex++ % adaptees.length)];
        switch (target.toLowerCase()) {
            case "google":
                this.adaptee = new GoogleAdaptee_1.GoogleAdaptee();
                break;
            case "microsoft":
                this.adaptee = new MicrosoftAdaptee_1.MicrosoftAdaptee();
                break;
            default:
                this.adaptee = new GoogleAdaptee_1.GoogleAdaptee();
                break;
        }
    };
    /**
     * retrieves the scheduled events of a specific user
     * @param {string | number} identifier the user identifier of choice
     * @param {boolean} filter whether the result should be filtered into a simpler JSON object
     * @param {any} options if left out then standard filtering is applied otherwise options specifies what keys should be passed on to the new object
     */
    Adapter.prototype.retrieveUserEvents = function (identifier, filter, options) {
        this.adaptee.retrieveUserEvents(identifier).then(function (bookings) {
            //console.log("Filtering result");
            if (!filter)
                return bookings;
            else
                return Utils.filter(bookings, options);
        });
    };
    return Adapter;
}());
exports.Adapter = Adapter;
