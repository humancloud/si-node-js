/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import Span from '../../trace/span/Span';
import { SpanCtorOptions } from './Span';
import SegmentRef from '../../trace/context/SegmentRef';
import { SpanType } from '../../proto/language-agent/Tracing_pb';
import { ContextCarrier } from '../context/ContextCarrier';

export default class EntrySpan extends Span {
  constructor(options: SpanCtorOptions) {
    super(
      Object.assign(options, {
        type: SpanType.ENTRY,
      }),
    );
  }

  extract(carrier: ContextCarrier): this {
    super.extract(carrier);

    const ref = SegmentRef.fromCarrier(carrier);

    this.refer(ref);

    return this;
  }
}
