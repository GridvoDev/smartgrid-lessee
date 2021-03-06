'use strict';
const _ = require('underscore');
const express = require('express');
const errCodeTable = require('../util/errCode.js');
const {expressWithZipkinTraceContextFeach:traceContextFeach} = require("gridvo-common-js");
const {logger} = require('../../util');

let router = express.Router();
router.post('/lessees', (req, res)=> {
    let resultJSON = {};
    let lesseeData = req.body;
    let lesseeService = req.app.get('lesseeService');
    let traceContext = traceContextFeach(req);
    lesseeService.registerLessee(lesseeData, traceContext, (err, isSuccess)=> {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        if (!isSuccess) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            res.json(resultJSON);
            logger.error("register lessee fail", traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        res.json(resultJSON);
        logger.info("register lessee success", traceContext);
    });
});
router.post('/lessees/:lesseeID/stations', (req, res)=> {
    let resultJSON = {};
    let lesseeID = req.params.lesseeID;
    let stationData = req.body;
    let lesseeService = req.app.get('lesseeService');
    let traceContext = traceContextFeach(req);
    lesseeService.addStationToLessee(lesseeID, stationData, traceContext, (err, stationID)=> {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        if (!stationID) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            resultJSON.stationID = null;
            res.json(resultJSON);
            logger.error("add station to lessee fail", traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.stationID = stationID;
        res.json(resultJSON);
        logger.info("add station to lessee success", traceContext);
    });
});
router.delete('/lessees/:lesseeID/stations/:stationID', (req, res)=> {
    let resultJSON = {};
    let lesseeID = req.params.lesseeID;
    let stationID = req.params.stationID;
    let lesseeService = req.app.get('lesseeService');
    let traceContext = traceContextFeach(req);
    lesseeService.delStationFromLessee(lesseeID, stationID, traceContext, (err, isSuccess)=> {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        if (!isSuccess) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            res.json(resultJSON);
            logger.error("delete station from lessee fail", traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        res.json(resultJSON);
        logger.info("delete station from lessee success", traceContext);
    });
});
router.delete('/lessees/:lesseeID', (req, res)=> {
    let resultJSON = {};
    let lesseeID = req.params.lesseeID;
    let lesseeService = req.app.get('lesseeService');
    let traceContext = traceContextFeach(req);
    lesseeService.delLessee(lesseeID, traceContext, (err, isSuccess)=> {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        if (!isSuccess) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            res.json(resultJSON);
            logger.error("delete lessee fail", traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        res.json(resultJSON);
        logger.info("delete lessee success", traceContext);
    });
});
router.post('/lessees/:corpID/change-wechat-active-state', (req, res)=> {
    let resultJSON = {};
    let corpID = req.params.corpID;
    let isActived = req.body.isActived;
    let lesseeService = req.app.get('lesseeService');
    let traceContext = traceContextFeach(req);
    lesseeService.changeCorpWechatActiveState(corpID, isActived, traceContext, (err, isSuccess)=> {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        if (!isSuccess) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            res.json(resultJSON);
            logger.error("change Corp Wechat Active State fail", traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        res.json(resultJSON);
        logger.info("change Corp Wechat Active State success", traceContext);
    });
});
router.get('/lessees/:lesseeID', (req, res)=> {
    let resultJSON = {};
    let lesseeID = req.params.lesseeID;
    let lesseeService = req.app.get('lesseeService');
    let traceContext = traceContextFeach(req);
    lesseeService.getLessee(lesseeID, traceContext, (err, lessee)=> {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        if (!lessee) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            res.json(resultJSON);
            logger.error("get lessee fail", traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.lessee = lessee;
        res.json(resultJSON);
        logger.info("get lessee success", traceContext);
    });
});
router.get('/lessees', (req, res)=> {
    let resultJSON = {};
    let lesseeService = req.app.get('lesseeService');
    let traceContext = traceContextFeach(req);
    lesseeService.getLessees(traceContext, (err, lessees)=> {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        if (!lessees) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            res.json(resultJSON);
            logger.error("get all lessee fail", traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.lessees = lessees;
        res.json(resultJSON);
        logger.info("get all lessee success", traceContext);
    });
});
router.get('/stations/:stationID', (req, res)=> {
    let resultJSON = {};
    let stationID = req.params.stationID;
    let lesseeService = req.app.get('lesseeService');
    let traceContext = traceContextFeach(req);
    lesseeService.getStation(stationID, traceContext, (err, station)=> {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        if (!station) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            res.json(resultJSON);
            logger.error("get station fail", traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.station = station;
        res.json(resultJSON);
        logger.info("get station success", traceContext);
    });
});
router.get('/stations', (req, res)=> {
    let resultJSON = {};
    let stationID = req.query.stationID;
    let lesseeService = req.app.get('lesseeService');
    let traceContext = traceContextFeach(req);
    lesseeService.getStations(traceContext, (err, stations)=> {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        if (!stations) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            res.json(resultJSON);
            logger.error("get all station fail", traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.stations = stations;
        res.json(resultJSON);
        logger.info("get all station success", traceContext);
    });
});


// router.post('/lessees/:lesseeID/stations/:stationID/members', (req, res)=> {
//     let resultJSON = {};
//     let lesseeID = req.params.lesseeID;
//     let stationID = req.params.stationID;
//     let memberID = req.body.memberID;
//     let lesseeService = req.app.get('lesseeService');
//     let traceContext = traceContextFeach(req);
//     lesseeService.assignMemberToLesseeStation(lesseeID, stationID, memberID, traceContext, (err, isSuccess)=> {
//         if (err) {
//             logger.error(err.message, traceContext);
//             return;
//         }
//         if (!isSuccess) {
//             resultJSON.errcode = errCodeTable.FAIL.errCode;
//             resultJSON.errmsg = errCodeTable.FAIL.errMsg;
//             res.json(resultJSON);
//             logger.error("register lessee fail", traceContext);
//             return;
//         }
//         resultJSON.errcode = errCodeTable.OK.errCode;
//         resultJSON.errmsg = errCodeTable.OK.errMsg;
//         res.json(resultJSON);
//         logger.info("register lessee success", traceContext);
//     });
// });

module.exports = router;