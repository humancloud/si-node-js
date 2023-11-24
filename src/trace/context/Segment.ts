/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import Span from '../../trace/span/Span';
import ID from '../../trace/ID';
import NewID from '../../trace/NewID';
import SegmentRef from '../../trace/context/SegmentRef';

export default class Segment {
  segmentId = new ID();
  spans: Span[] = [];
  relatedTraces: ID[] = [new NewID()];
  references: SegmentRef[] = [];

  archive(span: Span): void {
    this.spans.push(span);
  }

  relate(id: ID) {
    if (this.relatedTraces[0] instanceof NewID) {
      this.relatedTraces.shift();
    }
    if (!this.relatedTraces.includes(id)) {
      this.relatedTraces.push(id);
    }
  }

  refer(ref: SegmentRef): this {
    if (!this.references.includes(ref)) {
      this.references.push(ref);
    }

    return this;
  }
}
