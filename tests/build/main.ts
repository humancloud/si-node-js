/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import agent from 'stackinsights-backend-js';

agent.start({
  serviceName: 'server',
  maxBufferSize: 1000,
});
