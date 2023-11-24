/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import * as http from 'http';
import Redis from 'ioredis';
import agent from '../../../src';
import assert from 'assert';

agent.start({
  serviceName: 'server',
  maxBufferSize: 1000,
});

const client = new Redis({
  host: process.env.REDIS_HOST || 'redis',
});

const server = http.createServer((req, res) => {
  (async () => {
    const cacheKey = 'now';
    const now = '' + Date.now();

    await client.set(cacheKey, now);
    const _now = await client.get(cacheKey);
    assert.strictEqual(now, _now);

    res.end(_now);
  })().catch((err: Error) => {
    res.statusCode = 500;
    res.end(err.message);
  });
})

server.listen(5000, () => console.info('Listening on port 5000...'));
