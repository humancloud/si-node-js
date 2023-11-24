/*!
 *
 * Copyrights to StackInsights
 * All rights are reserved 2019
 *
 */

export interface Tag {
  readonly key: string;
  readonly overridable: boolean;
  val: string;
}

export default {
  coldStartKey: 'coldStart',
  httpStatusCodeKey: 'http.status.code', // TODO: maybe find a better place to put these?
  httpStatusMsgKey: 'http.status.msg',
  httpURLKey: 'http.url',
  httpMethodKey: 'http.method',
  dbTypeKey: 'db.type',
  dbInstanceKey: 'db.instance',
  dbStatementKey: 'db.statement',
  dbSqlParametersKey: 'db.sql.parameters',
  dbMongoParametersKey: 'db.mongo.parameters',
  mqBrokerKey: 'mq.broker',
  mqTopicKey: 'mq.topic',
  mqQueueKey: 'mq.queue',
  arnKey: 'arn',

  coldStart(val: boolean = true): Tag {
    return {
      key: this.coldStartKey,
      overridable: true,
      val: `${val}`,
    } as Tag;
  },
  httpStatusCode(val: string | number | undefined): Tag {
    return {
      key: this.httpStatusCodeKey,
      overridable: true,
      val: `${val}`,
    } as Tag;
  },
  httpStatusMsg(val: string | undefined): Tag {
    return {
      key: this.httpStatusMsgKey,
      overridable: true,
      val: `${val}`,
    } as Tag;
  },
  httpURL(val: string | undefined): Tag {
    return {
      key: this.httpURLKey,
      overridable: true,
      val: `${val}`,
    } as Tag;
  },
  httpMethod(val: string | undefined): Tag {
    return {
      key: this.httpMethodKey,
      overridable: true,
      val: `${val}`,
    } as Tag;
  },
  dbType(val: string | undefined): Tag {
    return {
      key: this.dbTypeKey,
      overridable: true,
      val: `${val}`,
    } as Tag;
  },
  dbInstance(val: string | undefined): Tag {
    return {
      key: this.dbInstanceKey,
      overridable: true,
      val: `${val}`,
    } as Tag;
  },
  dbStatement(val: string | undefined): Tag {
    return {
      key: this.dbStatementKey,
      overridable: true,
      val: `${val}`,
    } as Tag;
  },
  dbSqlParameters(val: string | undefined): Tag {
    return {
      key: this.dbSqlParametersKey,
      overridable: false,
      val: `${val}`,
    } as Tag;
  },
  dbMongoParameters(val: string | undefined): Tag {
    return {
      key: this.dbMongoParametersKey,
      overridable: false,
      val: `${val}`,
    } as Tag;
  },
  mqBroker(val: string | undefined): Tag {
    return {
      key: this.mqBrokerKey,
      overridable: true,
      val: `${val}`,
    } as Tag;
  },
  mqTopic(val: string | undefined): Tag {
    return {
      key: this.mqTopicKey,
      overridable: true,
      val: `${val}`,
    } as Tag;
  },
  mqQueue(val: string | undefined): Tag {
    return {
      key: this.mqQueueKey,
      overridable: true,
      val: `${val}`,
    } as Tag;
  },
  arn(val: string | undefined): Tag {
    return {
      key: this.arnKey,
      overridable: true,
      val: `${val}`,
    } as Tag;
  },
};
