'use strict';
const _ = require('underscore');
const express = require('express');
const errCodeTable = require('../util/errCode.js');
const {expressWithZipkinTraceContextFeach:traceContextFeach} = require("gridvo-common-js");
const {logger} = require('../../util');

let router = express.Router();
router.post('/permissions', (req, res) => {
    let resultJSON = {};
    let permissionData = req.body;
    let roleAndPermissionService = req.app.get('roleAndPermissionService');
    let traceContext = traceContextFeach(req);
    roleAndPermissionService.registerPermission(permissionData, traceContext, (err, isSuccess) => {
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
router.get('/permissions/:permissionID', (req, res) => {
    let resultJSON = {};
    let permissionID = req.params.permissionID;
    let roleAndPermissionService = req.app.get('roleAndPermissionService');
    let traceContext = traceContextFeach(req);
    roleAndPermissionService.getPermission(permissionID, traceContext, (err, permission) => {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        if (!permission) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            res.json(resultJSON);
            logger.error("get permission fail", traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.permission = permission;
        res.json(resultJSON);
        logger.info("get permission success", traceContext);
    });

});
router.get('/permissions', (req, res) => {
    let resultJSON = {};
    let roleAndPermissionService = req.app.get('roleAndPermissionService');
    let traceContext = traceContextFeach(req);
    roleAndPermissionService.getPermissions(traceContext, (err, permissions) => {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.permissions = permissions;
        logger.error("get all permissions success", traceContext);
        res.send(resultJSON);
    });
});
router.delete('/permissions/:permissionID', (req, res) => {
    let resultJSON = {};
    let permissionID = req.params.permissionID;
    let roleAndPermissionService = req.app.get('roleAndPermissionService');
    let traceContext = traceContextFeach(req);
    roleAndPermissionService.delPermission(permissionID, traceContext, (err, isSuccess) => {
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
router.post('/roles', (req, res) => {
    let resultJSON = {};
    let roleData = req.body;
    let roleAndPermissionService = req.app.get('roleAndPermissionService');
    let traceContext = traceContextFeach(req);
    roleAndPermissionService.registerRole(roleData, traceContext, (err, isSuccess) => {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        if (!isSuccess) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            res.json(resultJSON);
            logger.error("register role fail", traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        res.json(resultJSON);
        logger.info("register role success", traceContext);
    });
});
router.get('/roles/:roleID', (req, res) => {
    let resultJSON = {};
    let roleID = req.params.roleID;
    let roleAndPermissionService = req.app.get('roleAndPermissionService');
    let traceContext = traceContextFeach(req);
    roleAndPermissionService.getRole(roleID, traceContext, (err, role) => {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        if (!role) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            res.json(resultJSON);
            logger.error("get role fail", traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.role = role;
        res.json(resultJSON);
        logger.info("get role success", traceContext);
    });

});
router.get('/roles', (req, res) => {
    let resultJSON = {};
    let roleAndPermissionService = req.app.get('roleAndPermissionService');
    let traceContext = traceContextFeach(req);
    roleAndPermissionService.getRoles(traceContext, (err, roles) => {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.roles = roles;
        logger.error("get all roles success", traceContext);
        res.send(resultJSON);
    });
});
router.delete('/roles/:roleID', (req, res) => {
    let resultJSON = {};
    let roleID = req.params.roleID;
    let roleAndPermissionService = req.app.get('roleAndPermissionService');
    let traceContext = traceContextFeach(req);
    roleAndPermissionService.delRole(roleID, traceContext, (err, isSuccess) => {
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
router.post('/roles/:roleID/permissions', (req, res) => {
    let resultJSON = {};
    let roleID = req.params.roleID;
    let permissionID = req.body.permissionID;
    let roleAndPermissionService = req.app.get('roleAndPermissionService');
    let traceContext = traceContextFeach(req);
    roleAndPermissionService.assignPermissionToRole(permissionID, roleID, traceContext, (err, isSuccess) => {
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
            res.send(resultJSON);
            logger.error("assign permission fail", traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        res.send(resultJSON);
        logger.error("assign permission success", traceContext);
    });
});
router.delete('/roles/:roleID/permissions', (req, res) => {
    let resultJSON = {};
    let roleID = req.params.roleID;
    let permissionID = req.body.permissionID;
    let roleAndPermissionService = req.app.get('roleAndPermissionService');
    let traceContext = traceContextFeach(req);
    roleAndPermissionService.canclePermissionofRole(permissionID, roleID, traceContext, (err, isSuccess) => {
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
            res.send(resultJSON);
            logger.error("cancle permission fail", traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        res.send(resultJSON);
        logger.error("cancle permission success", traceContext);
    });
});

module.exports = router;