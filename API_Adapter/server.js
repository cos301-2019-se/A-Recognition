"use strict";
exports.__esModule = true;
var express_1 = require("express");
var app = express_1["default"]();
app.get('/adapter', function (req, res) {
    res.status(200).send({
        success: 'true',
        message: 'this should return something'
    });
});
var PORT = 5000;
app.listen(PORT, function () {
    console.log("server running on port " + PORT);
});
