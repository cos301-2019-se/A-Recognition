const https = require('https');

exports.makeRequest = function makeRequest(url,returnType,callback){
    https.get(url, (resp) => {
  let data = '';

  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {

    if(returnType != "JSON" &&  returnType != "All")
    console.log(data);
    else {

        try {
            return JSON.parse(data);
        } catch (error) {
            console.log("Could not JSON parse response!");
            return {};
        }
    }
   
  });

}).on("error", (err) => {
  

  if(returnType != "All")
    console.log("Error: " + err.message);
    else 
    return err;
});

    if(callback != undefined)
    callback();
}


