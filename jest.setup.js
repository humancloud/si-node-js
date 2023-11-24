/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

const waitForExpect = require('wait-for-expect');

jest.setTimeout(30000000);

waitForExpect.defaults.interval = 10000; // ms
waitForExpect.defaults.timeout = 120000; // ms
