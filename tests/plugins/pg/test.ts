/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import * as path from 'path';
import { DockerComposeEnvironment, StartedDockerComposeEnvironment, Wait } from 'testcontainers';
import axios from 'axios';
import waitForExpect from 'wait-for-expect';
import { promises as fs } from 'fs';

const rootDir = path.resolve(__dirname);

describe('plugin tests', () => {
  let compose: StartedDockerComposeEnvironment;

  beforeAll(async () => {
    compose = await new DockerComposeEnvironment(rootDir, 'docker-compose.yml')
      .withWaitStrategy('client', Wait.forHealthCheck())
      .withWaitStrategy('postgres', Wait.forHealthCheck())
      .up();
  });

  afterAll(async () => {
    await compose.down();
  });

  it(__filename, async () => {
    await waitForExpect(async () => expect((await axios.get('http://localhost:5001/postgres')).status).toBe(200));

    const expectedData = await fs.readFile(path.join(rootDir, 'expected.data.yaml'), 'utf8');

    try {
      await waitForExpect(async () =>
        expect((await axios.post('http://localhost:12800/dataValidate', expectedData)).status).toBe(200),
      );
    } catch (e) {
      const actualData = (await axios.get('http://localhost:12800/receiveData')).data;
      console.info({ actualData });
      throw e;
    }
  });
});
