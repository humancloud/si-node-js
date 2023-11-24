/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import config from '../../config/AgentConfig';
import Context from '../../trace/context/Context';
import { Component } from '../Component';
import { Tag } from '../../Tag';
import Log, { LogItem } from '../../Log';
import Segment from '../../trace/context/Segment';
import SegmentRef from '../../trace/context/SegmentRef';
import { SpanLayer, SpanType } from '../../proto/language-agent/Tracing_pb';
import { createLogger } from '../../logging';
import * as packageInfo from '../../../package.json';
import { ContextCarrier } from '../context/ContextCarrier';

export type SpanCtorOptions = {
  context: Context;
  operation: string;
  id?: number;
  parentId?: number;
  peer?: string;
  layer?: SpanLayer;
  component?: Component;
};

const logger = createLogger(__filename);

export default abstract class Span {
  readonly context: Context;
  readonly type: SpanType;

  id = -1;
  parentId = -1;
  peer = '';
  operation: string;
  layer = SpanLayer.UNKNOWN;
  component = Component.UNKNOWN;
  depth = 0;
  isCold = false;
  inherit?: Component;

  readonly tags: Tag[] = [];
  readonly logs: Log[] = [];
  readonly refs: SegmentRef[] = [];

  startTime = 0;
  endTime = 0;
  errored = false;
  lastError: Error | null = null;

  constructor(options: SpanCtorOptions & { type: SpanType }) {
    this.context = options.context;
    this.operation = options.operation;
    this.type = options.type;

    if (options.id !== undefined) this.id = options.id;
    if (options.parentId !== undefined) this.parentId = options.parentId;
    if (options.peer) this.peer = options.peer;
    if (options.layer) this.layer = options.layer;
    if (options.component) this.component = options.component;
  }

  start(): void {
    if (++this.depth === 1) {
      this.startTime = new Date().getTime();
      this.context.start(this);
    }
  }

  stop(): void {
    if (--this.depth === 0) this.context.stop(this);
  }

  async(): void {
    this.context.async(this);
  }

  resync(): void {
    this.context.resync(this);
  }

  finish(segment: Segment): boolean {
    if (this.isCold && config.coldEndpoint) this.operation = this.operation + '<cold>';

    this.endTime = new Date().getTime();
    segment.archive(this);
    return true;
  }

  // noinspection JSUnusedLocalSymbols
  inject(): ContextCarrier {
    throw new Error(`
      can only inject context carrier into ExitSpan, this may be a potential bug in the agent,
      please report this in ${packageInfo.bugs.url} if you encounter this.
    `);
  }

  extract(carrier: ContextCarrier): this {
    this.context.segment.relate(carrier.traceId!);

    return this;
  }

  hasTag(key: string) {
    return !this.tags.every((t) => t.key !== key);
  }

  tag(tag: Tag, insert?: boolean): this {
    if (tag.overridable) {
      const sameTags = this.tags.filter((it) => it.key === tag.key);

      if (sameTags.length) {
        sameTags.forEach((it) => (it.val = tag.val));

        return this;
      }
    }

    const tagObj = Object.assign({}, tag);

    if (!insert) this.tags.push(tagObj);
    else this.tags.unshift(tagObj);

    return this;
  }

  log(key: string, val: any): this {
    this.logs.push({
      timestamp: new Date().getTime(),
      items: [{ key, val: `${val}` }],
    } as Log);

    return this;
  }

  error(error: Error): this {
    if (error === this.lastError)
      // don't store duplicate identical error twice
      return this;

    this.errored = true;
    this.lastError = error;
    this.log('Stack', error?.stack || '');

    return this;
  }

  refer(ref: SegmentRef): this {
    if (!this.refs.includes(ref)) {
      this.refs.push(ref);
    }
    return this;
  }
}
