/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import { hostname } from 'os';
import SwPlugin from '../core/SwPlugin';
import ContextManager from '../trace/context/ContextManager';
import { Component } from '../trace/Component';
import Tag from '../Tag';
import Span from '../trace/span/Span';
import { SpanLayer } from '../proto/language-agent/Tracing_pb';
import PluginInstaller from '../core/PluginInstaller';
import { getAWS, execute } from '../aws/SDK2';

class AWS2SNSPlugin implements SwPlugin {
  readonly module = 'aws-sdk';
  readonly versions = '2.*';

  install(installer: PluginInstaller): void {
    const AWS = getAWS(installer);
    const _SNS = AWS.SNS;

    function SNS(this: any) {
      const sns = _SNS.apply(this, arguments);

      function instrument(name: string, addTraceId: any): void {
        const _func = sns[name];

        sns[name] = function (params: any, callback: any) {
          const to = params.TopicArn
            ? `Topic/${params.TopicArn.slice(params.TopicArn.lastIndexOf(':') + 1)}`
            : params.TargetArn
            ? `Target/${params.TargetArn.slice(params.TargetArn.lastIndexOf(':') + 1)}`
            : params.PhoneNumber
            ? `Phone/${params.PhoneNumber}`
            : '???';
          const operation = `AWS/SNS/${name}/${to}`;
          const span = ContextManager.current.newExitSpan(operation, Component.AWS_SNS, Component.HTTP);
          const arn = params.TopicArn || params.TargetArn;

          span.component = Component.AWS_SNS;
          span.layer = SpanLayer.MQ;

          if (arn) span.tag(Tag.arn(arn));

          if (params.TopicArn) params = addTraceId(params, span);

          return execute(span, this, _func, params, callback, 'mqBroker');
        };
      }

      instrument('publish', (params: any, span: Span) => {
        params = Object.assign({}, params);
        params.MessageAttributes = params.MessageAttributes ? Object.assign({}, params.MessageAttributes) : {};
        params.MessageAttributes.__revdTraceId = {
          DataType: 'String',
          StringValue: `${span.inject().value}/${hostname()}`,
        };

        return params;
      });

      instrument('publishBatch', (params: any, span: Span) => {
        const traceId = { __revdTraceId: { DataType: 'String', StringValue: `${span.inject().value}/${hostname()}` } };
        params = Object.assign({}, params);
        params.PublishBatchRequestEntries = params.PublishBatchRequestEntries.map(
          (e: any) =>
            (e = Object.assign({}, e, {
              MessageAttributes: e.MessageAttributes ? Object.assign({}, e.MessageAttributes, traceId) : traceId,
            })),
        );

        return params;
      });

      return sns;
    }

    Object.assign(SNS, _SNS);

    SNS.prototype = _SNS.prototype;
    AWS.SNS = SNS;
  }
}

// noinspection JSUnusedGlobalSymbols
export default new AWS2SNSPlugin();

// // Example code for test maybe:
// const AWS = require("aws-sdk");

// AWS.config.update({region: 'your-region'});

// const sns = new AWS.SNS();

// function callback(err, data) {
//     console.log('... callback err:', err);
//     console.log('... callback data:', data);
// }

// const message = {
//   Message: 'MESSAGE_TEXT', /* required */
//   TopicArn: 'topic_arn',  /* or other destinations */
// };

// sns.publish(message, callback);
// // OR:
// sns.publish(message).send(callback);
// // OR:
// sns.publish(message).promise()
//   .then(r => { console.log('... promise res:', r); })
//   .catch(e => { console.log('... promise err:', e); });
