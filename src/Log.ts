/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

export interface LogItem {
  key: string;
  val: string;
}

export default interface Log {
  timestamp: number;
  items: LogItem[];
}
