"use strict";
/**
* Adaptee responsible for exchanging data with Microsoft Office 365
* npm install simple-oauth2 --save
*/
// const credentials = {
//     userName : "8a223ec8-d71f-4",
//     password : "ImOOkg/A+Rz4dN+3NO"
// }
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// import { ExchangeService, ExchangeVersion, WebCredentials, Uri, DateTime, CalendarView, WellKnownFolderName, EwsLogging } from "ews-javascript-api";
// EwsLogging.DebugLogEnabled = false;
// var service = new ExchangeService(ExchangeVersion.Exchange2010);
// service.Credentials = new WebCredentials(credentials.userName, credentials.password);
// service.Url = new Uri("https://outlook.office365.com/Ews/Exchange.asmx");
// var view = new CalendarView(DateTime.Now,DateTime.Now.Add(1, "week")); 
// console.log(service);
// service.FindAppointments(WellKnownFolderName.Calendar, view).then((response) => {
//     let appointments = response.Items;
//     let appointment = appointments[0];
//     console.log("Subject: " + appointment.Subject);
//     console.log("Start Time: " + appointment.Start);
//     console.log("End Time: " + appointment.End);
//     console.log("Recipients: ");
//     // appointment.RequiredAttendees.Items.forEach((a) => {
//     //     console.log(a.Address);
//     // });
//     console.log("unique id: " + appointment.Id.UniqueId, true, true);
// }, function (error) {
//     console.log(error);
// })
var MicrosoftAdaptee = /** @class */ (function () {
    function MicrosoftAdaptee() {
    }
    /**
     * retrieves the scheduled events of a specific user
     * @param {any} identifier the user identifier of choice
     */
    MicrosoftAdaptee.prototype.getUserEvents = function (identifier, resultSize) {
        if (identifier === void 0) { identifier = "primary"; }
        if (resultSize === void 0) { resultSize = 2; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        resolve("I am not implemented yet");
                    })];
            });
        });
    };
    /**
     * retrieves the calendars associated with a user
     */
    MicrosoftAdaptee.prototype.getUserCalendars = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        resolve("I am not implemented yet");
                    })];
            });
        });
    };
    return MicrosoftAdaptee;
}());
exports.MicrosoftAdaptee = MicrosoftAdaptee;
