/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import { URL } from 'url';
import ContextManager from '../trace/context/ContextManager';
import { Component } from '../trace/Component';
import Tag from '../Tag';
import { SpanLayer } from '../proto/language-agent/Tracing_pb';
import { ContextCarrier } from '../trace/context/ContextCarrier';
import DummySpan from '../trace/span/DummySpan';
import { ignoreHttpMethodCheck } from '../config/AgentConfig';

class AzureHttpTriggerPlugin {
  wrap(func: any) {
    return function (this: any, context: any) {
      let outRet = true;
      let outName: any;

      for (const def of context.bindingDefinitions || []) {
        if (def.type === 'http' && def.directioun === 'out') {
          outName = def.name;
          outRet = outName === '$return';
        }
      }

      const req = context.req;
      const url = new URL(req.url);
      const operation = url.pathname.replace(/\?.*$/g, '');
      const carrier = ContextCarrier.from(req.headers);

      const span: any = ignoreHttpMethodCheck(req.method)
        ? DummySpan.create()
        : ContextManager.current.newEntrySpan(operation, carrier);

      span.layer = SpanLayer.HTTP;
      span.component = Component.AZURE_HTTPTRIGGER;
      span.peer = (req.headers['x-forwarded-for'] || '???').split(',').shift();

      span.tag(Tag.httpMethod(req.method));
      span.tag(Tag.httpURL(url.origin + url.pathname));

      span.start();

      let stop = (_ret?: any) => {
        stop = (v: any) => v;

        const res = outRet ? _ret : context.bindings[outName] || context.res;
        const status = span.errored ? 500 : !res ? 0 : res.status || 200;

        if (status) {
          span.tag(Tag.httpStatusCode(status));

          if (status >= 400) span.errored = true;
        }

        span.stop();

        return _ret;
      };

      const done = context.done;
      let did = false;

      context.done = function (err: any, _ret: any) {
        if (!did) {
          if (err) span.error(err);

          if (arguments.length >= 2) arguments[1] = stop(_ret);
          else stop();

          did = true;
        }

        return done.apply(this, arguments);
      };

      let ret;

      try {
        ret = func.apply(this, arguments);
      } catch (err) {
        span.error(err);
        stop();

        throw err;
      }

      if (ret && typeof ret.then === 'function') {
        // generic Promise check
        ret = ret.then(
          (_ret: any) => {
            return stop(_ret);
          },

          (err: any) => {
            span.error(err);
            stop();

            return Promise.reject(err);
          },
        );
      }

      span.async();

      return ret;
    };
  }
}

// noinspection JSUnusedGlobalSymbols
export default new AzureHttpTriggerPlugin();
