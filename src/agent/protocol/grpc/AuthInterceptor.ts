/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import * as grpc from '@grpc/grpc-js';
import config from '../../../config/AgentConfig';

export default function AuthInterceptor() {
  const mata = new grpc.Metadata();
  if (config.authorization) {
    mata.add('Authentication', config.authorization);
  }
  return mata;
}
