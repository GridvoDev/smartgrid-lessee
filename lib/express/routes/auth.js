'use strict';
var _ = require('underscore');
var express = require('express');
var router = express.Router();
var errCodeTable = require('../util/errCode.js');

router.post('/members/:memberID/check-member-permission', function (req, res) {
    var resultJSON = {};
    var memberID = req.params.memberID;
    var permissionID = req.body.permissionID;
    var bearcat = req.app.get('bearcat');
    var authService = bearcat.getBean('authService');
    authService.checkMemberPermission(memberID, permissionID, function (err, isSuccess) {
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
            resultJSON.isSuccess = isSuccess;
            res.send(resultJSON);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.isSuccess = isSuccess;
        res.send(resultJSON);
    });
});
router.post('/members/:memberID/auth-member', function (req, res) {
    var resultJSON = {};
    var memberID = req.params.memberID;
    var bearcat = req.app.get('bearcat');
    var authService = bearcat.getBean('authService');
    authService.authMember(memberID, function (err, memberData) {
        if (err) {
            resultJSON.errcode = errCodeTable.ERR.errCode;
            resultJSON.errmsg = errCodeTable.ERR.errMsg;
            resultJSON.memberData = null;
            res.send(resultJSON);
            return;
        }
        if (!memberData) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            resultJSON.memberData = null;
            res.send(resultJSON);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.memberData = memberData;
        res.send(resultJSON);
    });
});

module.exports = router;