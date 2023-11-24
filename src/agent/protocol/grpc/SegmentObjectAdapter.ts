/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import config from '../../../config/AgentConfig';
import { KeyStringValuePair } from '../../../proto/common/Common_pb';
import Segment from '../../../trace/context/Segment';
import { Log, RefType, SegmentObject, SegmentReference, SpanObject } from '../../../proto/language-agent/Tracing_pb';

/**
 * An adapter that adapts {@link Segment} objects to gRPC object {@link SegmentObject}.
 */
export default class SegmentObjectAdapter extends SegmentObject {
  constructor(segment: Segment) {
    super();
    super
      .setService(config.serviceName)
      .setServiceinstance(config.serviceInstance)
      .setTraceid(segment.relatedTraces[0].toString())
      .setTracesegmentid(segment.segmentId.toString())
      .setSpansList(
        segment.spans.map((span) =>
          new SpanObject()
            .setSpanid(span.id)
            .setParentspanid(span.parentId)
            .setStarttime(span.startTime)
            .setEndtime(span.endTime)
            .setOperationname(span.operation)
            .setPeer(span.peer)
            .setSpantype(span.type)
            .setSpanlayer(span.layer)
            .setComponentid(span.component.id)
            .setIserror(span.errored)
            .setLogsList(
              span.logs.map((log) =>
                new Log()
                  .setTime(log.timestamp)
                  .setDataList(
                    log.items.map((logItem) => new KeyStringValuePair().setKey(logItem.key).setValue(logItem.val)),
                  ),
              ),
            )
            .setTagsList(span.tags.map((tag) => new KeyStringValuePair().setKey(tag.key).setValue(tag.val)))
            .setRefsList(
              span.refs.map((ref) =>
                new SegmentReference()
                  .setReftype(RefType.CROSSPROCESS)
                  .setTraceid(ref.traceId.toString())
                  .setParenttracesegmentid(ref.segmentId.toString())
                  .setParentspanid(ref.spanId)
                  .setParentservice(ref.service)
                  .setParentserviceinstance(ref.serviceInstance)
                  .setNetworkaddressusedatpeer(ref.clientAddress),
              ),
            ),
        ),
      );
  }
}
