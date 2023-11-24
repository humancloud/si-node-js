/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import agent from '../../../src';
import * as http from 'http';

agent.start({
  serviceName: 'server',
  maxBufferSize: 1000,
});

const server = http.createServer((req, res) => {
  http
  .request('http://httpbin.org/json', (r) => {
    let data = '';
    r.on('data', (chunk) => (data += chunk));
    r.on('end', () => res.end(data));
  })
  .end();
});

server.listen(5000, () => console.info('Listening on port 5000...'));
