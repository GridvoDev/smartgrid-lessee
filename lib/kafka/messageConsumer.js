'use strict';
const {KafkaZipkinMessageConsumer, kafkaWithZipkinTraceContextFeach} = require('gridvo-common-js');
const {tracer} = require('../util');
const {
    createLesseeService
} = require('../application');
const {logger} = require('../util');

class Consumer {
    constructor(serviceName = "smartgrid-lessee") {
        this._consumer = new KafkaZipkinMessageConsumer({tracer, serviceName});
        this._lesseeService = createLesseeService();
    }

    startConsume() {
        let topics = [{
            topic: "corp-auth-smartgrid-suite"
        },{
            topic: "corp-cancel-auth-smartgrid-suite"
        }];
        let self = this;
        this._consumer.consumeMessage(topics, (err, message)=> {
            if (err) {
                logger.error(err.message);
                return;
            }
            let data = JSON.parse(message.value);
            let traceContext = kafkaWithZipkinTraceContextFeach(data);
            switch (message.topic) {
                case "corp-auth-smartgrid-suite":
                    self._lesseeService.changeCorpWechatActiveState(data.corpID, true, traceContext, (err, isSuccess)=> {
                        if (err) {
                            logger.error(err.message, traceContext);
                            return;
                        }
                        if (isSuccess) {
                            logger.info(`corp ${data.corpID} change wechat active state success`, traceContext);
                        } else {
                            logger.error(`corp ${data.corpID} change wechat active state fail`, traceContext);
                        }
                    });
                    return;
                case "corp-cancel-auth-smartgrid-suite":
                    self._lesseeService.changeCorpWechatActiveState(data.corpID, false, traceContext, (err, isSuccess)=> {
                        if (err) {
                            logger.error(err.message, traceContext);
                            return;
                        }
                        if (isSuccess) {
                            logger.info(`corp ${data.corpID} change wechat active state success`, traceContext);
                        } else {
                            logger.error(`corp ${data.corpID} change wechat active state fail`, traceContext);
                        }
                    });
                    return;
                default:
                    logger.error(`unknow topic "${message.topic}"`, traceContext);
                    return;
            }
        });
    }

    stopConsume(callback) {
        this._consumer.close(callback);
    }
}

module.exports = Consumer;