/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import Span, { SpanCtorOptions } from '../../trace/span/Span';
import { SpanType } from '../../proto/language-agent/Tracing_pb';

export default class LocalSpan extends Span {
  constructor(options: SpanCtorOptions) {
    super(
      Object.assign(options, {
        type: SpanType.LOCAL,
      }),
    );
  }
}
