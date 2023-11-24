/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import * as http from 'http';
import agent from '../../../src';
import express from 'express';

agent.start({
  serviceName: 'client',
  maxBufferSize: 1000,
});

const app = express();

const testRouter = express.Router();
app.use('/test', testRouter);

testRouter.get('/express', (req, res) => {
  http
  .request(`http://${process.env.SERVER || 'localhost:5000'}${req.url}`, (r) => {
    let data = '';
    r.on('data', (chunk) => (data += chunk));
    r.on('end', () => res.send(data));
  })
  .end();
});

app.listen(5001, () => console.info('Listening on port 5001...'));
