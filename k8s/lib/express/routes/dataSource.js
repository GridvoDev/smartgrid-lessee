// 'use strict';
// const _ = require('underscore');
// const express = require('express');
// const errCodeTable = require('../util/errCode.js');
// const {expressWithZipkinTraceContextFeach:traceContextFeach} = require("gridvo-common-js");
// const {logger} = require('../../util');
//
// let router = express.Router();
// router.post('/dataSources', (req, res)=> {
//     let resultJSON = {};
//     let dataSource = req.body;
//     let dataSourceService = req.app.get('dataSourceService');
//     let traceContext = traceContextFeach(req);
//     dataSourceService.registerDataSource(dataSource, traceContext, (err, isSuccess)=> {
//         if (err) {
//             logger.error(err.message, traceContext);
//             return;
//         }
//         if (!isSuccess) {
//             resultJSON.errcode = errCodeTable.FAIL.errCode;
//             resultJSON.errmsg = errCodeTable.FAIL.errMsg;
//             res.json(resultJSON);
//             logger.error("register dataSource fail", traceContext);
//             return;
//         }
//         resultJSON.errcode = errCodeTable.OK.errCode;
//         resultJSON.errmsg = errCodeTable.OK.errMsg;
//         res.json(resultJSON);
//         logger.info("register dataSource success", traceContext);
//     });
// });
// router.delete('/dataSources/:dataSourceID', (req, res)=> {
//     let resultJSON = {};
//     let dataSourceID = req.params.dataSourceID;
//     let dataSourceService = req.app.get('dataSourceService');
//     let traceContext = traceContextFeach(req);
//     dataSourceService.delDataSource(dataSourceID, traceContext, (err, isSuccess)=> {
//         if (err) {
//             logger.error(err.message, traceContext);
//             return;
//         }
//         if (!isSuccess) {
//             resultJSON.errcode = errCodeTable.FAIL.errCode;
//             resultJSON.errmsg = errCodeTable.FAIL.errMsg;
//             res.json(resultJSON);
//             logger.error("delete dataSource fail", traceContext);
//             return;
//         }
//         resultJSON.errcode = errCodeTable.OK.errCode;
//         resultJSON.errmsg = errCodeTable.OK.errMsg;
//         res.json(resultJSON);
//         logger.info("delete dataSource success", traceContext);
//     });
// });
// router.get('/dataSources', (req, res)=> {
//     let resultJSON = {};
//     let dataSourceID = req.query.dataSourceID;
//     let dataSourceService = req.app.get('dataSourceService');
//     let traceContext = traceContextFeach(req);
//     dataSourceService.getDataSources(dataSourceID, traceContext, (err, datas)=> {
//         if (err) {
//             logger.error(err.message, traceContext);
//             return;
//         }
//         if (!datas) {
//             resultJSON.errcode = errCodeTable.FAIL.errCode;
//             resultJSON.errmsg = errCodeTable.FAIL.errMsg;
//             res.json(resultJSON);
//             logger.error("get dataSource fail", traceContext);
//             return;
//         }
//         resultJSON.errcode = errCodeTable.OK.errCode;
//         resultJSON.errmsg = errCodeTable.OK.errMsg;
//         resultJSON.datas = datas;
//         res.json(resultJSON);
//         logger.info("get dataSource success", traceContext);
//     });
// });
//
// module.exports = router;