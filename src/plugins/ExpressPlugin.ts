/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import SwPlugin from '../core/SwPlugin';
import { ServerResponse } from 'http';
import ContextManager from '../trace/context/ContextManager';
import { Component } from '../trace/Component';
import Tag from '../Tag';
import { ContextCarrier } from '../trace/context/ContextCarrier';
import DummySpan from '../trace/span/DummySpan';
import { ignoreHttpMethodCheck } from '../config/AgentConfig';
import PluginInstaller from '../core/PluginInstaller';
import HttpPlugin from './HttpPlugin';
import { Request } from 'express';

class ExpressPlugin implements SwPlugin {
  readonly module = 'express';
  readonly versions = '*';

  install(installer: PluginInstaller): void {
    this.interceptServerRequest(installer);
  }

  private interceptServerRequest(installer: PluginInstaller) {
    const router = installer.require?.('express/lib/router') ?? require('express/lib/router');
    const _handle = router.handle;

    router.handle = function (req: Request, res: ServerResponse, next: any) {
      const carrier = ContextCarrier.from((req as any).headers || {});
      const reqMethod = req.method ?? 'GET';
      const operation = reqMethod + ':' + (req.originalUrl || req.url || '/').replace(/\?.*/g, '');
      const span = ignoreHttpMethodCheck(reqMethod)
        ? DummySpan.create()
        : ContextManager.current.newEntrySpan(operation, carrier, [Component.HTTP_SERVER, Component.EXPRESS]);

      span.component = Component.EXPRESS;

      if (span.depth)
        // if we inherited from http then just change component ID and let http do the work
        return _handle.apply(this, arguments);

      return HttpPlugin.wrapHttpResponse(span, req, res, () => {
        // http plugin disabled, we use its mechanism anyway
        try {
          return _handle.call(this, req, res, (err: Error) => {
            span.error(err);
            next.call(this, err);
          });
        } finally {
          // req.protocol is only possibly available after call to _handle()
          span.tag(
            Tag.httpURL(
              ((req as any).protocol ? (req as any).protocol + '://' : '') + (req.headers.host || '') + req.url,
            ),
          );
        }
      });
    };
  }
}

// noinspection JSUnusedGlobalSymbols
export default new ExpressPlugin();
