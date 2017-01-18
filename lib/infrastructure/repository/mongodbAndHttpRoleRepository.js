'use strict';
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var request = require('request');
var _ = require('underscore');
var Role = require('../../domain/roleAndPermission/role');

function Repository() {
    var MONGODB_SERVICE_HOST = process.env.MONGODB_SERVICE_HOST ? process.env.MONGODB_SERVICE_HOST : "127.0.0.1";
    var MONGODB_SERVICE_PORT = process.env.MONGODB_SERVICE_PORT ? process.env.MONGODB_SERVICE_PORT : "27017";
    this.dBUrl = `mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/TestGLesseeAuthentication`;
    this.__httpRequest__ = request;
    this.__permissionRepository__ = null;
};

Repository.prototype.saveRole = function (role, callback) {
    var repository = this;
    var mongoDB;
    var permissionIDs = [];
    for (var permission of role.permissions) {
        permissionIDs.push(permission.permissionID);
    }
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        let updateOperations = {};
        updateOperations.roleID = role.roleID;
        updateOperations.roleName = role.roleName;
        updateOperations.permissionIDs = permissionIDs;
        mongoDB.collection("role").updateOne({
                roleID: role.roleID,
            },
            {
                $set: updateOperations
            },
            {
                upsert: true

            },
            cb);
    }], function (err, result) {
        if (err) {
            callback(err, false);
            mongoDB.close();
            return;
        }
        if (result.result.n == 1) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
        mongoDB.close();
    });
};
Repository.prototype.getRoleByID = function (roleID, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        var cursor = db.collection('role').find({"roleID": roleID});
        cursor.limit(1).next(cb);
    }], function (err, document) {
        if (err) {
            callback(err, null);
            mongoDB.close();
            return;
        }
        if (_.isNull(document)) {
            callback(null, null);
            mongoDB.close();
            return;
        }
        var role = new Role(document);
        callback(null, role);
        mongoDB.close();
    });
};
Repository.prototype.getRolesByIDs = function (roleIDs, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        mongoDB.collection("role").find({"roleID": {"$in": roleIDs}}).toArray(cb);
    }, function (roleDatas, cb) {
        var roles = [];
        async.each(roleDatas,
            function (roleData, cb) {
                if (!roleData) {
                    callback(null, null);
                    mongoDB.close();
                    return;
                }
                var role = {};
                role.roleID = roleData.roleID;
                role.roleName = roleData.roleName;
                role.permissions = [];
                role = new Role(role);
                repository.__permissionRepository__.getPermissionsByIDs(roleData.permissionIDs, function (err, permissions) {
                    if (err) {
                        cb(err);
                        return;
                    }
                    role.permissions = permissions;
                    roles.push(role);
                    cb();
                });
            }, function (err) {
                if (err) {
                    callback(err, null);
                    mongoDB.close();
                    return;
                }
                cb(null, roles);
            });
    }], function (err, roles) {
        if (err) {
            callback(err, null);
            mongoDB.close();
            return;
        }
        callback(null, roles);
        mongoDB.close();
    });
};

module.exports = Repository;