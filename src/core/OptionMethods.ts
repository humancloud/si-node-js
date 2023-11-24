/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

import PluginInstaller from './PluginInstaller';

export default interface OptionMethods {
  getVersion?(installer: PluginInstaller): string;
}
