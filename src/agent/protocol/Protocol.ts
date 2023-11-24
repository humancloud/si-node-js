/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

/**
 * The transport protocol between the agent and the backend (OAP).
 */
export default interface Protocol {
  isConnected: boolean;

  heartbeat(): this;

  report(): this;

  flush(): Promise<any> | null;
}
