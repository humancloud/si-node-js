/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import PluginInstaller from './PluginInstaller';
import Span from '../trace/span/Span';
import OptionMethods from './OptionMethods';

export default interface SwPlugin extends OptionMethods {
  readonly module: string;
  readonly versions: string;
  readonly isBuiltIn?: boolean;

  install(installer: PluginInstaller): void;
}

export const wrapEmit = (span: Span, ee: any, doError: boolean = true, stop: any = NaN) => {
  // stop = NaN because NaN !== NaN
  const stopIsFunc = typeof stop === 'function';
  const _emit = ee.emit;

  Object.defineProperty(ee, 'emit', {
    configurable: true,
    writable: true,
    value: function (this: any): any {
      const event = arguments[0];

      span.resync();

      try {
        if (doError && event === 'error') span.error(arguments[1]);

        return _emit.apply(this, arguments);
      } catch (err) {
        span.error(err);

        throw err;
      } finally {
        if (stopIsFunc ? stop(event) : event === stop) span.stop();
        else span.async();
      }
    },
  });
};

export const wrapCallback = (span: Span, callback: any, idxError: any = false) => {
  return function (this: any) {
    if (idxError !== false && arguments[idxError]) span.error(arguments[idxError]);

    span.stop();

    return callback.apply(this, arguments);
  };
};

export const wrapPromise = (span: Span, promise: any) => {
  return promise.then(
    (res: any) => {
      span.stop();

      return res;
    },

    (err: any) => {
      span.error(err);
      span.stop();

      return Promise.reject(err);
    },
  );
};
