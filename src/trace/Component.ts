/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

export class Component {
  static readonly UNKNOWN = new Component(0);
  static readonly HTTP = new Component(2);
  static readonly MYSQL = new Component(5);
  static readonly REDIS = new Component(7);
  static readonly MONGODB = new Component(9);
  static readonly POSTGRESQL = new Component(22);
  static readonly HTTP_SERVER = new Component(49);
  static readonly RABBITMQ_PRODUCER = new Component(52);
  static readonly RABBITMQ_CONSUMER = new Component(53);
  static readonly AZURE_HTTPTRIGGER = new Component(111);
  static readonly AWSLAMBDA_FUNCTION = new Component(124);
  static readonly AWSLAMBDA_GATEWAYAPIHTTP = new Component(125);
  static readonly AWSLAMBDA_GATEWAYAPIREST = new Component(126);
  static readonly AWS_DYNAMODB = new Component(138);
  static readonly AWS_SNS = new Component(139);
  static readonly AWS_SQS = new Component(140);
  static readonly EXPRESS = new Component(4002);
  static readonly AXIOS = new Component(4005);
  static readonly MONGOOSE = new Component(4006);

  constructor(public readonly id: number) {}
}
