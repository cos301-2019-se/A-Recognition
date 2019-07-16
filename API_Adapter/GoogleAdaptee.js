"use strict";
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
var fs = require("fs");
var readline = require("readline");
var googleapis_1 = require("googleapis");
// If modifying these scopes, delete token.json.
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
var TOKEN_PATH = 'token.json';
/**
* Adaptee responsible for exchanging data with Google Calendar
*/
var GoogleAdaptee = /** @class */ (function () {
    function GoogleAdaptee() {
    }
    /**
     * retrieves the scheduled events of a specific user
     * @param {any} identifier the user identifier of choice
     */
    GoogleAdaptee.prototype.retrieveUserEvents = function (identifier) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // const promise = new Promise(async (resolve, reject) => {
                console.log("Getting credentials");
                try {
                    this.loadClientSecrets().then(function (credentials) {
                        console.log("Got credentials,calling auth", credentials);
                        // resolve(credentials);
                    });
                }
                catch (error) {
                    // reject(error);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Load client secrets from a local file.
     */
    GoogleAdaptee.prototype.loadClientSecrets = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                try {
                                    fs.readFile('credentials.json', function (err, content) {
                                        console.log("In readfile");
                                        if (err) {
                                            throw new Error('Error loading client secret file:' + err);
                                        }
                                        resolve(JSON.parse(content.toString()));
                                    });
                                }
                                catch (error) {
                                    reject(error);
                                }
                                return [2 /*return*/];
                            });
                        }); }).then(function (res) {
                            console.log("returning res", res);
                            return res;
                        })["catch"](function (err) {
                        })];
                    case 1:
                        promise = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    GoogleAdaptee.prototype.authorize = function (credentials, callback) {
        var _this = this;
        console.log("In auth");
        var _a = credentials.installed, client_secret = _a.client_secret, client_id = _a.client_id, redirect_uris = _a.redirect_uris;
        var oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, function (err, token) {
            if (err)
                return _this.getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token.toString()));
            callback(oAuth2Client);
        });
    };
    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    GoogleAdaptee.prototype.getAccessToken = function (oAuth2Client, callback) {
        var authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });
        //Prompt user to authorise the app
        console.log('Authorize this app by visiting this url:', authUrl);
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        //Prompt user to enter their code from google
        rl.question('Enter the code from that page here: ', function (code) {
            rl.close();
            //Get token
            oAuth2Client.getToken(code, function (err, token) {
                if (err)
                    return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), function (err) {
                    if (err)
                        return console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                return callback(oAuth2Client);
            });
        });
    };
    /**
     * Lists the next 10 events on the user's primary calendar.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    GoogleAdaptee.prototype.listEvents = function (auth) {
        var calendar = googleapis_1.google.calendar({ version: 'v3', auth: auth });
        calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime'
        }, function (err, res) {
            if (err)
                return console.log('The API returned an error: ' + err);
            //This is the main point of displaying current events or bookings
            var bookings = res.data.items;
            if (bookings.length) {
                bookings.map(function (event, i) {
                });
                console.log(bookings);
                return bookings;
            }
            else {
                console.log('No upcoming events found.');
            }
        });
        return [];
    };
    return GoogleAdaptee;
}());
exports.GoogleAdaptee = GoogleAdaptee;
