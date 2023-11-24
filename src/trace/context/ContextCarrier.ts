/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import ID from '../../trace/ID';
import { CarrierItem } from './CarrierItem';

export class ContextCarrier extends CarrierItem {
  constructor(
    public traceId?: ID,
    public segmentId?: ID,
    public spanId?: number,
    public service?: string,
    public serviceInstance?: string,
    public endpoint?: string,
    public clientAddress?: string,
    public items: CarrierItem[] = [],
  ) {
    super('sw8');
    this.items.push(this);
  }

  private encode = (s: string): string => {
    return Buffer.from(s).toString('base64');
  };

  private decode = (s: string): string => {
    return Buffer.from(s, 'base64').toString();
  };

  get value(): string {
    return this.isValid()
      ? [
          '1',
          this.encode(this.traceId?.toString() || ''),
          this.encode(this.segmentId?.toString() || ''),
          this.spanId?.toString(),
          this.encode(this.service || ''),
          this.encode(this.serviceInstance || ''),
          this.encode(this.endpoint || ''),
          this.encode(this.clientAddress || ''),
        ].join('-')
      : '';
  }

  set value(val) {
    if (!val) {
      return;
    }
    const parts = val.split('-');
    if (parts.length != 8) {
      return;
    }
    this.traceId = new ID(this.decode(parts[1]));
    this.segmentId = new ID(this.decode(parts[2]));
    this.spanId = Number.parseInt(parts[3], 10);
    this.service = this.decode(parts[4]);
    this.serviceInstance = this.decode(parts[5]);
    this.endpoint = this.decode(parts[6]);
    this.clientAddress = this.decode(parts[7]);
  }

  isValid(): boolean {
    return Boolean(
      this.traceId?.rawId &&
        this.segmentId?.rawId &&
        this.spanId !== undefined &&
        !isNaN(this.spanId) &&
        this.service &&
        this.endpoint &&
        this.clientAddress !== undefined,
    );
  }

  public static from(map: { [key: string]: string }): ContextCarrier | undefined {
    if (!Object.prototype.hasOwnProperty.call(map, 'sw8')) return;

    const carrier = new ContextCarrier();

    carrier.items
      .filter((item) => Object.prototype.hasOwnProperty.call(map, item.key))
      .forEach((item) => (item.value = map[item.key]));

    return carrier;
  }
}
