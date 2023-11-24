/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

export abstract class CarrierItem {
  abstract get value(): string;
  abstract set value(val: string);

  protected constructor(public key: string) {}
}
