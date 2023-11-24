/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import ContextManager from '../trace/context/ContextManager';

export function trace(op?: string) {
  return (target: any, key: string, descriptor?: PropertyDescriptor) => {
    if (descriptor === undefined) {
      return;
    }

    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const span = ContextManager.current.newLocalSpan(op || key);

      span.start();

      const result = original.apply(this, args);

      span.stop();

      return result;
    };
  };
}
