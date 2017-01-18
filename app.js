'use strict';
const kafka = require('kafka-node');
const express = require('express');
const {expressZipkinMiddleware} = require("gridvo-common-js");
const {logger, tracer} = require('./lib/util');
const {lesseeRouter} = require('./lib/express');
const {
    createAuthService,
    createLesseeService,
    createRoleAndPermissionService
} = require('./lib/application');
const {MessageConsumer} = require('./lib/kafka');

let app;
let {ZOOKEEPER_SERVICE_HOST = "127.0.0.1", ZOOKEEPER_SERVICE_PORT = "2181"} = process.env;
let Producer = kafka.HighLevelProducer;
let client = new kafka.Client(`${ZOOKEEPER_SERVICE_HOST}:${ZOOKEEPER_SERVICE_PORT}`);
let initProducer = new Producer(client);
initProducer.on('ready', function () {
    initProducer.createTopics(["corp-auth-smartgrid-suite",
        "corp-cancel-auth-smartgrid-suite"], true, (err)=> {
        if (err) {
            logger.error(err.message);
            return;
        }
        client.refreshMetadata(["corp-auth-smartgrid-suite", "corp-cancel-auth-smartgrid-suite"], ()=> {
            initProducer.close(()=> {
                logger.info("init kafka topics success");
                let messageConsumer = new MessageConsumer();
                messageConsumer.startConsume();
                logger.info("start consuming topics");
            });
        });
    });
});
initProducer.on('error', (err)=> {
    console.log(err);
});
app = express();
app.use(expressZipkinMiddleware({
    tracer: tracer,
    serviceName: 'smartgrid-lessee'
}));

// //中间件
//
//     app.use(bodyParser.json());
//
//     app.use(bodyParser.urlencoded({ extended: false }));


//路由注册

app.use('/', lesseeRouter);
let authService = createAuthService();
app.set('authService', authService);
let lesseeService = createLesseeService();
app.set('lesseeService', lesseeService);
let roleAndPermissionService = createRoleAndPermissionService();
app.set('roleAndPermissionService', roleAndPermissionService);

app.listen(3001, (err)=> {
    if (err) {
        logger.error(err.message);
    }
    else {
        logger.info("express server is starting");
    }
});