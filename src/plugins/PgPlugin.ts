/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import SwPlugin, { wrapEmit, wrapCallback, wrapPromise } from '../core/SwPlugin';
import ContextManager from '../trace/context/ContextManager';
import { Component } from '../trace/Component';
import Tag from '../Tag';
import { SpanLayer } from '../proto/language-agent/Tracing_pb';
import PluginInstaller from '../core/PluginInstaller';
import agentConfig from '../config/AgentConfig';

class MySQLPlugin implements SwPlugin {
  readonly module = 'pg';
  readonly versions = '*';

  install(installer: PluginInstaller): void {
    const Client = installer.require?.('pg/lib/client') ?? require('pg/lib/client');

    let Cursor: any;

    try {
      Cursor = installer.require?.('pg-cursor') ?? require('pg-cursor');
    } catch {
      /* Linter food */
    }

    const _query = Client.prototype.query;

    Client.prototype.query = function (config: any, values: any, callback: any) {
      let query: any;

      const host = `${this.host}:${this.port}`;
      const span = ContextManager.current.newExitSpan('pg/query', Component.POSTGRESQL);

      span.start();

      try {
        span.component = Component.POSTGRESQL;
        span.layer = SpanLayer.DATABASE;
        span.peer = host;

        span.tag(Tag.dbType('PostgreSQL'));
        span.tag(Tag.dbInstance(`${this.connectionParameters.database}`));

        let _sql: any;
        let _values: any;

        if (typeof config === 'string') _sql = config;
        else if (config !== null && config !== undefined) {
          _sql = config.text;
          _values = config.values;

          if (typeof config.callback === 'function') config.callback = wrapCallback(span, config.callback, 0);
        }

        if (typeof values === 'function') values = wrapCallback(span, values, 0);
        else if (_values !== undefined) _values = values;

        if (typeof callback === 'function') callback = wrapCallback(span, callback, 0);

        span.tag(Tag.dbStatement(`${_sql}`));

        if (agentConfig.sqlTraceParameters && _values) {
          let vals = _values.map((v: any) => (v === undefined ? 'undefined' : JSON.stringify(v))).join(', ');

          if (vals.length > agentConfig.sqlParametersMaxLength)
            vals = vals.slice(0, agentConfig.sqlParametersMaxLength) + ' ...';

          span.tag(Tag.dbSqlParameters(`[${vals}]`));
        }

        query = _query.call(this, config, values, callback);

        if (query) {
          if (Cursor && query instanceof Cursor) wrapEmit(span, query, true, 'end');
          else if (typeof query.then === 'function')
            // generic Promise check
            query = wrapPromise(span, query);
          // else we assume there was a callback
        }
      } catch (e) {
        span.error(e);
        span.stop();

        throw e;
      }

      span.async();

      return query;
    };
  }
}

// noinspection JSUnusedGlobalSymbols
export default new MySQLPlugin();
