const WebSocket = require('ws');
var mysql = require('mysql');
require('dotenv').config();

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

con.connect(function(err) {
  if(err) throw err;
  console.log("Connected to database!");
});

const wss = new WebSocket.Server({port: 8080})
wss.on('connection', ws => {
  ws.on('message', message => {
  
    var jsonData = JSON.parse(message);
    const { appId: profileId } = jsonData;
    console.log(`Connection from ${profileId}`);
    
    if("timeOnPageMs" in jsonData) {
    
      const { timeOn, page } = jsonData;

      var sql = "UPDATE `analytics` SET `time_active` = time_active + " + timeOn + " WHERE `userId` = '" + profileId + "' L$
      con.query(sql, function(err, result, fields) {
        if (err) throw err;
        console.log(`${profileId} logged ${(timeOn / 1000)} seconds on page ${page}`);
      });
      
    }
    
  });
});
