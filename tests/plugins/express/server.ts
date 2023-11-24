/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import agent from '../../../src';
import * as http from 'http';

import express from 'express';

agent.start({
  serviceName: 'server',
  maxBufferSize: 1000,
});
const app = express();

app.get('/express', (req, res) => {
  http
  .request('http://httpbin.org/json', (r) => {
    let data = '';
    r.on('data', (chunk) => (data += chunk));
    r.on('end', () => res.send(data));
  })
  .end();
});

app.listen(5000, () => console.info('Listening on port 5000...'));
