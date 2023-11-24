/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import Span from '../../trace/span/Span';
import { ContextCarrier } from '../context/ContextCarrier';
import Context from '../context/Context';
import { SpanType } from '../../proto/language-agent/Tracing_pb';
import DummyContext from '../context/DummyContext';

export default class DummySpan extends Span {
  static create(context?: Context): DummySpan {
    return new DummySpan({
      context: context ?? new DummyContext(),
      operation: '',
      type: SpanType.LOCAL,
    });
  }

  start(): any {
    if (!this.depth++) this.context.start(this);
  }

  stop(block?: any): void {
    if (!--this.depth) this.context.stop(this);
  }

  async(block?: any): void {
    this.context.async(this);
  }

  resync(): any {
    this.context.resync(this);
  }

  error(error: Error, statusOverride?: number): this {
    return this;
  }

  inject(): ContextCarrier {
    return new ContextCarrier();
  }

  extract(carrier: ContextCarrier): this {
    return this;
  }
}
