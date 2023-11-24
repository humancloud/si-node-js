/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import Protocol from '../../../agent/protocol/Protocol';
import HeartbeatClient from '../../../agent/protocol/grpc/clients/HeartbeatClient';
import TraceReportClient from '../../../agent/protocol/grpc/clients/TraceReportClient';

export default class GrpcProtocol implements Protocol {
  private readonly heartbeatClient: HeartbeatClient;
  private readonly traceReportClient: TraceReportClient;

  constructor() {
    this.heartbeatClient = new HeartbeatClient();
    this.traceReportClient = new TraceReportClient();
  }

  get isConnected(): boolean {
    return this.heartbeatClient.isConnected && this.traceReportClient.isConnected;
  }

  heartbeat(): this {
    this.heartbeatClient.start();
    return this;
  }

  report(): this {
    this.traceReportClient.start();
    return this;
  }

  flush(): Promise<any> | null {
    return this.traceReportClient.flush();
  }
}
