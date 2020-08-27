const WebSocket = require('ws');
var mysql = require('mysql');
require('dotenv').config();


const { DB_HOST: host,  DB_USER: user, DB_PASS: password, DB_NAME: database } = process.env;

const connection = mysql.createConnection({ host, user, password, database });

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database!");
});

const wss = new WebSocket.Server({port: 8080})
wss.on('connection', ws => {
  ws.on('message', message => {
    const jsonData = JSON.parse(message);
    const { appId: profileId } = jsonData;
    console.log(`Connection from ${profileId}`);
    
    if("timeOnPageMs" in jsonData) {
      const { timeOn, page } = jsonData;
      var sql = "UPDATE `analytics` SET `time_active` = time_active + " + timeOn + " WHERE `userId` = '" + profileId + '"';
      connection.query(sql, function(err, result, fields) {
        if (err) throw err;
        console.log(`${profileId} logged ${(timeOn / 1000)} seconds on page ${page}`);
      });
    }
  });
});
