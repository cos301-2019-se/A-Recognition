var express = require('express');
var app = express();
var fs = require("fs");

const { exec } = require('child_process');

app.get('/allow', function (req, res) {
    console.log("Allow");
    exec('/usr/bin/firefox success.html', (err, stdout, stderr) => {
        if (err)
        {
            console.log("Could not open the browser!");
        }
        return;
    });
    res.end('DOne');
})

app.get('/deny', function (req, res) {
    exec('/usr/bin/firefox failure.html', (err, stdout, stderr) => {
        if (err)
        {
            console.log("Could not open the browser!");
        }
        return;
    });
    res.end('Done');
 })

 app.get('/wait', function (req, res) {
    exec('/usr/lib/firefox/firefox/firefox wait.html', (err, stdout, stderr) => {
        if (err)
        {
            console.log("Could not open the browser!");
        }
        return;
    });
    res.end('Done');
 })

var server = app.listen(42069, function ()
{
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})