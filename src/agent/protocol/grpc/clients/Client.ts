/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

export default interface Client {
  readonly isConnected: boolean;

  start(): void;

  flush(): Promise<any> | null;
}
