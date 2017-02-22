'use strict';
const _ = require('underscore');
var request = require('request');
var async = require('async');
const {createMongoZipkinClient} = require('gridvo-common-js');
const {Menber} = require('../../domain/lesseeAndMember');
const {tracer} = require('../../util');
const {GRIDVO_WECHAT_SERVICE_HOST = "127.0.0.1", GRIDVO_WECHAT_SERVICE_PORT = "3001"} = process.env;

class Repository {
    constructor() {
        this._dbName = "Menber";
        this._collectionName = "MenberInfo";
        this._serviceName = "smartgrid-lessee";
        this.httpUrl = `http://${GRIDVO_WECHAT_SERVICE_HOST}:${GRIDVO_WECHAT_SERVICE_PORT}/auth-corps/corpID/suiteID/users'`;
        this.__httpRequest__ = request;
        this.__roleRepository__ = null;
    }
    getMemberByID(memberID, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
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
            console.log(wechatUserData);
        //     var roleIDs = [];
        //     var roleID;
        //     for (var tag of wechatUserData.tags) {
        //         roleID = tag.tagID;
        //         roleIDs.push(roleID);
        //     }
        //     repository.__roleRepository__.getRolesByIDs(roleIDs, cb);
        // }], function (err, roles) {
        //     if (err) {
        //         callback(err, null);
        //         return;
        //     }
        //     ;
        //     var member = {};
        //     member.memberID = wechatUserData.userID;
        //     member.memberInfo = {};
        //     member.memberInfo.memberName = wechatUserData.username;
        //     member.lesseeID = wechatUserData.corpID;
        //     member.roles = roles;
        //     member.state = wechatUserData.state;
        //     member = new Member(member);
            callback(null, member);
        }]);
    };
}

module.exports = Repository;