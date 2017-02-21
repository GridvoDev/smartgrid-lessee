'use strict';
const _ = require('underscore');
const express = require('express');
const errCodeTable = require('../util/errCode.js');
const {expressWithZipkinTraceContextFeach:traceContextFeach} = require("gridvo-common-js");
const {logger} = require('../../util');

let router = express.Router();
router.post('/permissions', (req, res)=> {
    var resultJSON = {};
    var permissionData = req.body;
    let roleAndPermissionService = req.app.get('roleAndPermissionService');
    let traceContext = traceContextFeach(req);
    roleAndPermissionService.registerPermission(permissionData, traceContext, (err, isSuccess)=> {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        if (!isSuccess) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            res.json(resultJSON);
            logger.error("register permission fail", traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        res.json(resultJSON);
        logger.info("register permission success", traceContext);
    });
});
router.get('/permissions', (req, res)=> {
    var resultJSON = {};
    var permissionID = req.body;
    let roleAndPermissionService = req.app.get('roleAndPermissionService');
    let traceContext = traceContextFeach(req);
    if(!permissionID){
        roleAndPermissionService.obtainAllPermission(traceContext, (err, permissions)=> {
            if (err) {
                logger.error(err.message, traceContext);
                return;
            }
            resultJSON.errcode = errCodeTable.OK.errCode;
            resultJSON.errmsg = errCodeTable.OK.errMsg;
            resultJSON.permissions = permissions;
            logger.error("obtain permissions fail", traceContext);
            res.send(resultJSON);
        });
    }else{
        roleAndPermissionService.getPermission(permissionID, traceContext, (err, permission) => {
            if (err) {
                logger.error(err.message, traceContext);
                return;
            }
            if (!permission) {
                resultJSON.errcode = errCodeTable.FAIL.errCode;
                resultJSON.errmsg = errCodeTable.FAIL.errMsg;
                res.json(resultJSON);
                logger.error("obtain permission fail", traceContext);
                return;
            }
            resultJSON.errcode = errCodeTable.OK.errCode;
            resultJSON.errmsg = errCodeTable.OK.errMsg;
            resultJSON.permission = permission;
            res.json(resultJSON);
            logger.info("obtain permission success", traceContext);
        });
    }

});
router.delete('/permissions/:permissionID', (req, res)=> {
    var resultJSON = {};
    var permissionID = req.params.permissionID;
    let roleAndPermissionService = req.app.get('roleAndPermissionService');
    let traceContext = traceContextFeach(req);
    roleAndPermissionService.delPermission(permissionID, traceContext, (err, isSuccess)=> {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        if (!isSuccess) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            res.json(resultJSON);
            logger.error("delete permission fail", traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        res.json(resultJSON);
        logger.info("delete permission success", traceContext);
    });
});
router.post('/roles/:roleID/permissions', (req, res)=> {
    var resultJSON = {};
    var roleID = req.params.roleID;
    var permissionIDs = req.body.permissionIDs;
    var bearcat = req.app.get('bearcat');
    var roleAndPermissionService = bearcat.getBean('roleAndPermissionService');
    roleAndPermissionService.assignPermissionsToRole(permissionIDs, roleID, (err, isSuccess)=> {
        if (err) {
            resultJSON.errcode = errCodeTable.ERR.errCode;
            resultJSON.errmsg = errCodeTable.ERR.errMsg;
            resultJSON.isSuccess = false;
            res.send(resultJSON);
            return;
        }
        if (!isSuccess) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            resultJSON.isSuccess = false;
            res.send(resultJSON);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.isSuccess = true;
        res.send(resultJSON);
    });
});
router.delete('/roles/:roleID/permissions', (req, res)=> {
    var resultJSON = {};
    var roleID = req.params.roleID;
    var permissionIDs = req.body.permissionIDs;
    var bearcat = req.app.get('bearcat');
    var roleAndPermissionService = bearcat.getBean('roleAndPermissionService');
    roleAndPermissionService.canclePermissionsofRole(permissionIDs, roleID, (err, isSuccess)=> {
        if (err) {
            resultJSON.errcode = errCodeTable.ERR.errCode;
            resultJSON.errmsg = errCodeTable.ERR.errMsg;
            resultJSON.isSuccess = false;
            res.send(resultJSON);
            return;
        }
        if (!isSuccess) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            resultJSON.isSuccess = false;
            res.send(resultJSON);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.isSuccess = true;
        res.send(resultJSON);
    });
});
router.get('/roles', (req, res)=> {
    var resultJSON = {};
    var bearcat = req.app.get('bearcat');
    var roleAndPermissionService = bearcat.getBean('roleAndPermissionService');
    roleAndPermissionService.obtainAllRole(function (err, roleDatas) {
        if (err) {
            resultJSON.errcode = errCodeTable.ERR.errCode;
            resultJSON.errmsg = errCodeTable.ERR.errMsg;
            resultJSON.roleDatas = null;
            res.send(resultJSON);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.roleDatas = roleDatas;
        res.send(resultJSON);
    });
});

module.exports = router;