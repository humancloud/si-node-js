/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import { v4 as uuid } from 'uuid';

export default class ID {
  constructor(public rawId: string = uuid().replace(/-/gi, '')) {}

  public toString = (): string => {
    return this.rawId;
  };
}
