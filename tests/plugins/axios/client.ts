/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import * as http from 'http';
import agent from '../../../src';
import axios from 'axios';

agent.start({
  serviceName: 'client',
  maxBufferSize: 1000,
});

const server = http.createServer(async (req, res) => {
  await axios
  .get(`http://${process.env.SERVER || 'localhost:5000'}${req.url}`)
  .then((r) => res.end(JSON.stringify(r.data)))
  .catch(err => res.end(JSON.stringify(err)));
});

server.listen(5001, () => console.info('Listening on port 5001...'));
