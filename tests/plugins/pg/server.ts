/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import * as http from 'http';
import {Client} from 'pg';
import agent from '../../../src';

agent.start({
  serviceName: 'server',
  maxBufferSize: 1000,
})

const server = http.createServer((req, res) => {
  const client = new Client({
    host: process.env.POSTGRES_HOST || 'postgres',
    user: 'root',
    password: 'root',
    database: 'test'
  });
  client.connect();
  client.query(`SELECT * FROM "user" where name = 'u1'`).then(
    (resDB: any) => {
      res.end(JSON.stringify(resDB.rows));
      client.end();
    },
    (err: any) => {
      client.end();
    },
  );
})

server.listen(5000, () => console.info('Listening on port 5000...'));
