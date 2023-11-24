/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import * as http from 'http';
import {MongoClient} from 'mongodb';
import agent from '../../../src';

process.env.SW_AGENT_LOGGING_LEVEL = 'ERROR';

agent.start({
  serviceName: 'server',
  maxBufferSize: 1000,
});

const server = http.createServer(async (req, res) => {
  await new Promise((resolve, reject) => {
    MongoClient.connect(`mongodb://root:root@${process.env.MONGO_HOST}:27017`, {useUnifiedTopology: true}, function(err: any, client: any) {
      if (err) {
          res.end(`${err}`);
          resolve(null);
      } else {
        client.db('admin').collection('docs').findOne().then(
          (resDB: any) => {
            res.end(`${resDB}`);
            resolve(null);
            client.close();
          },
          (err: any) => {
            res.end(`${err}`);
            resolve(null);
            client.close();
          },
        );
      }
    });
  });
});

server.listen(5000, () => console.info('Listening on port 5000...'));
