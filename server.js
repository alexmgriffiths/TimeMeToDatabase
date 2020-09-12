const WebSocket = require('ws');
const mysql = require('mysql');
require('dotenv').config();

const { DB_HOST: host,  DB_USER: user, DB_PASS: password, DB_NAME: database } = process.env;
const pool = mysql.createPool({ host, user, password, database });

const wss = new WebSocket.Server({port: 8080})
wss.on('connection', ws => {
  ws.on('message', message => {

    const jsonData = JSON.parse(message);
    const { appId: timerId } = jsonData;

    if("timeOnPageMs" in jsonData) {

      const { timeOnPageMs, pageName } = jsonData;
      const sql = "UPDATE `mw_staff_timers` SET `time_active` = time_active + " + timeOnPageMs + " WHERE `id` =  " + timerId;

      pool.getConnection((err, connection) => {
        connection.query(sql, function(err, result, fields) {

          connection.release();
          if (err) throw err;

        });
      });
    }
  });
});
