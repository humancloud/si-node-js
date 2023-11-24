/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import config, { AgentConfig, finalizeConfig } from './config/AgentConfig';
import Protocol from './agent/protocol/Protocol';
import GrpcProtocol from './agent/protocol/grpc/GrpcProtocol';
import { createLogger } from './logging';
import PluginInstaller from './core/PluginInstaller';
import SpanContext from './trace/context/SpanContext';

const logger = createLogger(__filename);

class Agent {
  private started = false;
  private protocol: Protocol | null = null;

  start(options: AgentConfig = {}): void {
    if (process.env.SW_DISABLE === 'true') {
      logger.info('StackInsights agent is disabled by `SW_DISABLE=true`');
      return;
    }

    if (this.started) {
      logger.warn('StackInsights agent started more than once, subsequent options to start ignored.');
      return;
    }

    Object.assign(config, options);
    finalizeConfig(config);

    logger.debug('Starting StackInsights agent');

    new PluginInstaller().install();

    this.protocol = new GrpcProtocol().heartbeat().report();
    this.started = true;
  }

  flush(): Promise<any> | null {
    if (this.protocol === null) {
      logger.warn('Trying to flush() StackInsights agent which is not started.');
      return null;
    }

    const spanContextFlush = SpanContext.flush(); // if there are spans which haven't finished then wait for them
    const protocol = this.protocol;

    if (!spanContextFlush) return protocol.flush();

    return new Promise((resolve) => {
      spanContextFlush.then(() => {
        const protocolFlush = protocol.flush();

        if (!protocolFlush) resolve(null);
        else protocolFlush.then(() => resolve(null));
      });
    });
  }
}

export default new Agent();
export { default as config } from './config/AgentConfig';
export { default as ContextManager } from './trace/context/ContextManager';
export { default as AzureHttpTriggerPlugin } from './azure/AzureHttpTriggerPlugin';
export { default as AWSLambdaTriggerPlugin } from './aws/AWSLambdaTriggerPlugin';
export { default as AWSLambdaGatewayAPIHTTP } from './aws/AWSLambdaGatewayAPIHTTP';
export { default as AWSLambdaGatewayAPIREST } from './aws/AWSLambdaGatewayAPIREST';
