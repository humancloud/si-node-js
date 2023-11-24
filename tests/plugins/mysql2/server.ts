/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import * as http from 'http';
import mysql from 'mysql2';
import agent from '../../../src';

agent.start({
  serviceName: 'server',
  maxBufferSize: 1000,
})

const server = http.createServer((req, res) => {
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'mysql',
    user: 'root',
    password: 'root',
    database: 'test'
  });
  connection.query(
    'SELECT * FROM `user` WHERE `name` = "u1"',
    function (err: any, results: any, fields: any) {
      res.end(JSON.stringify({
        results,
        fields
      }))
    }
  );
})

server.listen(5000, () => console.info('Listening on port 5000...'));
