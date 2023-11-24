/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import * as http from 'http';
import agent from '../../../src';

process.env.SW_AGENT_LOGGING_LEVEL = 'ERROR';

agent.start({
  serviceName: 'client',
  maxBufferSize: 1000,
})

const server = http.createServer((req, res) => {
  http
    .request(`http://${process.env.SERVER || 'localhost:5000'}${req.url}`, (r) => {
      let data = '';
      r.on('data', (chunk) => (data += chunk));
      r.on('end', () => res.end(data));
    })
    .end();
});

server.listen(5001, () => console.info('Listening on port 5001...'));
