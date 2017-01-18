'use strict';
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var request = require('request');
var _ = require('underscore');
var Member = require('../../domain/lesseeAndMember/member');

function Repository() {
    var MONGODB_SERVICE_HOST = process.env.MONGODB_SERVICE_HOST ? process.env.MONGODB_SERVICE_HOST : "127.0.0.1";
    var MONGODB_SERVICE_PORT = process.env.MONGODB_SERVICE_PORT ? process.env.MONGODB_SERVICE_PORT : "27017";
    this.dBUrl = `mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/TestGLesseeAuthentication`;
    this.httpUrl = "";
    this.__httpRequest__ = request;
    this.__roleRepository__ = null;
}

Repository.prototype.getMemberByID = function (memberID, callback) {
    var repository = this;
    var wechatUserData;
    async.waterfall([function (cb) {
        var url = repository.httpUrl;
        var options = {
            method: "GET",
            url: url,
            json: true
        };
        repository.__httpRequest__(options, cb);
    }, function (response, body, cb) {
        if (!body || body.errcode != 0) {
            callback(null, null);
            return;
        }
        wechatUserData = body.userInfo;
        /**
         * {
         *  corpID: ,
         *  userID: ,
         *  username: ,
         *  tags: [
         *      { tagID: , tagName: },
         *      ...
         *  ],
         *  state: ,
         */
        var roleIDs = [];
        var roleID;
        for (var tag of wechatUserData.tags) {
            roleID = tag.tagID;
            roleIDs.push(roleID);
        }
        repository.__roleRepository__.getRolesByIDs(roleIDs, cb);
    }], function (err, roles) {
        if (err) {
            callback(err, null);
            return;
        };
        var member = {};
        member.memberID = wechatUserData.userID;
        member.memberInfo = {};
        member.memberInfo.memberName = wechatUserData.username;
        member.lesseeID = wechatUserData.corpID;
        member.roles = roles;
        member.state = wechatUserData.state;
        member = new Member(member);
        callback(null, member);
    });
};

module.exports = Repository;