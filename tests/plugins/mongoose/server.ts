/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import * as http from 'http';
import mongoose from 'mongoose';
import agent from '../../../src';

process.env.SW_AGENT_LOGGING_LEVEL = 'ERROR';

agent.start({
  serviceName: 'server',
  maxBufferSize: 1000,
});

const server = http.createServer(async (req, res) => {
  await new Promise((resolve, reject) => {
    mongoose.connect(`mongodb://root:root@${process.env.MONGO_HOST}:27017/admin`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,

    }).then(() => {
      const Test = new mongoose.Schema({
        title: String
      });

      const modelTest = mongoose.model('Test', Test);

      modelTest.find().then(
        (result: any) => {
          res.end(`${result}`);
          resolve(null);
          mongoose.connection.close();
        },

        (err: Error) => {
          res.end(`${err}`);
          resolve(null);
          mongoose.connection.close();
        },
      );

    }).catch((err: Error) => {
      res.end(`${err}`);
      resolve(null);
    });
  });
});

server.listen(5000, () => console.info('Listening on port 5000...'));
