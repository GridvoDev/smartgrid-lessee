'use strict';
const kafka = require('kafka-node');
const _ = require('underscore');
const co = require('co');
const should = require('should');
const muk = require('muk');
const MessageConsumer = require('../../lib/kafka/messageConsumer');

describe('messageConsumer() use case test', ()=> {
    let messageConsumer;
    let client;
    let producer;
    before(done=> {
        function setupKafka() {
            return new Promise((resolve, reject)=> {
                let {ZOOKEEPER_SERVICE_HOST = "127.0.0.1", ZOOKEEPER_SERVICE_PORT = "2181"} = process.env;
                client = new kafka.Client(
                    `${ZOOKEEPER_SERVICE_HOST}:${ZOOKEEPER_SERVICE_PORT}`,
                    "test-consumer-client");
                producer = new kafka.Producer(client);
                producer.on('ready', ()=> {
                    producer.createTopics(["corp-auth-smartgrid-suite",
                        "corp-cancel-auth-smartgrid-suite"], true, (err, data)=> {
                        if (err) {
                            reject(err)
                        }
                        client.refreshMetadata(["corp-auth-smartgrid-suite",
                            "corp-cancel-auth-smartgrid-suite"], (err)=> {
                            if (err) {
                                reject(err)
                            }
                            let message = {
                                corpID: "wxf8b4f85f3a794e77",
                                timestamp: 1403610513000,
                                zipkinTrace: {
                                    traceID: "aaa",
                                    parentID: "bbb",
                                    spanID: "ccc",
                                    flags: 1,
                                    step: 3
                                }
                            };
                            producer.send([{
                                topic: "corp-auth-smartgrid-suite",
                                messages: [JSON.stringify(message)]
                            }], (err)=> {
                                if (err) {
                                    reject(err)
                                }
                                resolve();
                            });
                        });
                    });
                });
                producer.on('error', (err)=> {
                    reject(err);
                });
            });
        };
        function* setup() {
            yield setupKafka();
        };
        co(setup).then(()=> {
            messageConsumer = new MessageConsumer("test-smartgrid-lessee");
            done();
        }).catch(err=> {
            done(err);
        });
    });
    describe('#startConsume()', ()=> {
        context('start consume message', ()=> {
            it('should call lesseeService.changeLesseeWechatActiveState methods when consumer this topic', done=> {
                var mockLesseeService = {};
                mockLesseeService.changeCorpWechatActiveState = ()=> {
                    done();
                };
                muk(messageConsumer, "_lesseeService", mockLesseeService);
                messageConsumer.startConsume();
            });
            after(done=> {
                producer.close();
                client.close(()=> {
                    done();
                });
            });
        });
    });
    after(done=> {
        messageConsumer.stopConsume(()=> {
            done();
        });
    });
});