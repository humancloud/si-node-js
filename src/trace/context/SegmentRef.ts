/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import ID from '../../trace/ID';
import { ContextCarrier } from './ContextCarrier';

export default class SegmentRef {
  private constructor(
    public refType: 'CrossProcess' | 'CrossThread' = 'CrossProcess',
    public traceId: ID,
    public segmentId: ID,
    public spanId: number,
    public service: string,
    public serviceInstance: string,
    public endpoint: string,
    public clientAddress: string,
  ) {
    this.traceId = traceId;
    this.segmentId = segmentId;
    this.spanId = spanId;
    this.service = service;
    this.serviceInstance = serviceInstance;
    this.endpoint = endpoint;
    this.clientAddress = clientAddress;
  }

  static fromCarrier(carrier: ContextCarrier): SegmentRef {
    return new SegmentRef(
      'CrossProcess',
      carrier.traceId!,
      carrier.segmentId!,
      carrier.spanId!,
      carrier.service!,
      carrier.serviceInstance!,
      carrier.endpoint!,
      carrier.clientAddress!,
    );
  }
}
