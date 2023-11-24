/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import Span from '../../trace/span/Span';
import { SpanCtorOptions } from './Span';
import config from '../../config/AgentConfig';
import { SpanType } from '../../proto/language-agent/Tracing_pb';
import { ContextCarrier } from '../context/ContextCarrier';
import ContextManager from '../context/ContextManager';

export default class ExitSpan extends Span {
  constructor(options: SpanCtorOptions) {
    super(
      Object.assign(options, {
        type: SpanType.EXIT,
      }),
    );
  }

  inject(): ContextCarrier {
    return new ContextCarrier(
      this.context.segment.relatedTraces[0],
      this.context.segment.segmentId,
      this.id,
      config.serviceName,
      config.serviceInstance,
      this.operation,
      this.peer,
      [],
    );
  }
}
