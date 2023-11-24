/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import agent from '../../../src';
import * as http from 'http';
import axios from 'axios';

agent.start({
  serviceName: 'server',
  maxBufferSize: 1000,
});

const server = http.createServer(async (req, res) => {
  const r = await axios.get('http://httpbin.org/json');
  res.end(JSON.stringify(r.data));
});

server.listen(5000, () => console.info('Listening on port 5000...'));
