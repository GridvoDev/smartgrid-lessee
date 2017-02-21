'use strict';
var EventEmitter = require('events');
var _ = require('underscore');
var async = require('async');
var util = require('util');
var constants = require('../util/index');

function Service() {
    EventEmitter.call(this);
    this.__memberRepository__ = null;
}
util.inherits(Service, EventEmitter);

Service.prototype.checkMemberPermission = function (memberID, permissionID, callback) {
    if (!memberID || !permissionID) {
        callback(null, false);
        return;
    }
    var self = this;
    async.waterfall([
        function (cb) {
            self.__memberRepository__.getMemberByID(memberID, cb);
        }], function (err, member) {
        if (err) {
            callback(err, null);
            return;
        }
        if (!member) {
            callback(null, false);
            return;
        }
        callback(null, member.hadPermission(permissionID));
    });
};
Service.prototype.authMember = function (memberID, callback) {
    if (!memberID) {
        callback(null, null);
        return;
    }
    var self = this;
    async.waterfall([
        function (cb) {
            self.__memberRepository__.getMemberByID(memberID, cb);
        }], function (err, member) {
        if (err) {
            callback(err, null);
            return;
        }
        if(!member){
            callback(null, null);
            return;
        }
        var memberData = {};
        memberData.memberID = member.memberID;
        memberData.memberName = member.memberInfo.memberName;
        callback(null, memberData);
    });
};

module.exports = Service;
