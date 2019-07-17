const https = require('https');
const url = "";


  https.get(url, (resp) => {
  let data = '';

  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {

    console.log(data);
    
  });

}).on("error", (err) => {
  
    console.log("Error: " + err.message);
});




