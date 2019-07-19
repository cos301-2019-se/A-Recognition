"use strict";
exports.__esModule = true;
/**
 * Filename: mainREST.ts
 * Version: V1.0
 * Author: JJ Goschen
 * Project name: A-Recognition (Advance)
 * Organization: Singularity
 * Funtional description: Provides an api to access main.ts functions
*/
//npm install express --save
//pip3 install firebase-admin
//pip3 install firebase
var Main = require("./main");
var express = require("express");
var app = express();
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.listen(3000, function () {
    console.log("Server running on port 3000");
});
app.get("/getUsersFromDaysEvents", function (req, res, next) {
    Main.getUsersFromDaysEvents().then(function (users) { return res.json(users); })["catch"](function (err) { return res.send(err); });
});
app.post("/getUsersFromDaysEvents", function (req, res) {
    Main.getUsersFromDaysEvents().then(function (users) { return res.json(users); })["catch"](function (err) { return res.send(err); });
});
app.get("/validateUserHasBooking", function (req, res, next) {
    var email;
    var room;
    if (req.query.hasOwnProperty("email") && req.query.hasOwnProperty("room")) {
        email = JSON.parse(req.query.email);
        room = JSON.parse(req.query.room);
        Main.validateUserHasBooking(email, room).then(function (msg) { res.send(msg); console.log(msg); })["catch"](function (err) { return res.send(err); });
    }
    else {
        res.send("Please send email and room name");
    }
});
app.post("/validateUserHasBooking", function (req, res, next) {
    var email;
    var room;
    console.log(req.query);
    if (req.query.hasOwnProperty("email") && req.query.hasOwnProperty("room")) {
        email = req.query.email;
        room = req.query.room;
        Main.validateUserHasBooking(email, room).then(function (msg) { res.send(msg); console.log(msg); })["catch"](function (err) { return res.send(err); });
    }
    else {
        res.send("Please send email and room name");
    }
});
app.post("/richardsResponse", function (req, res, next) {
    //console.log(req.body);
    var answer = req.body;
    console.log(answer);
    res.send(answer);
});
app.get('/getEmails', function (req, res) {
    Main.getEmployeeEmails().then(function (employees) {
        res.json(employees);
    })["catch"](function (err) { return res.send(err); });
});
app.get('/isEmployee', function (req, res) {
    var email = req.query.email;
    if (email == undefined)
        res.send("Please send a valid email");
    else
        Main.isEmployee(JSON.parse(email)).then(function (result) {
            res.send(result);
        })["catch"](function (result) {
            res.send(result);
        });
});
