'use strict';
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var request = require('request');
var _ = require('underscore');
var Permission = require('../../domain/roleAndPermission/permission.js');

function Repository() {
    var MONGODB_SERVICE_HOST = process.env.MONGODB_SERVICE_HOST ? process.env.MONGODB_SERVICE_HOST : "127.0.0.1";
    var MONGODB_SERVICE_PORT = process.env.MONGODB_SERVICE_PORT ? process.env.MONGODB_SERVICE_PORT : "27017";
    this.dBUrl = `mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/TestGLesseeAuthentication`;
};

Repository.prototype.savePermission = function (permission, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        let updateOperations = {};
        updateOperations.permissionID = permission.permissionID;
        updateOperations.permissionName = permission.permissionName;
        mongoDB.collection("permission").updateOne({
                permissionID: permission.permissionID,
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
Repository.prototype.getAllPermission = function (callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        mongoDB.collection("permission").find().toArray(cb);
    }], function (err, documents) {
        if (err) {
            callback(err, null);
            mongoDB.close();
            return;
        }
        var permissions = [];
        for (var document of documents) {
            var permission = new Permission(document);
            permissions.push(permission);
        }
        callback(null, permissions);
        mongoDB.close();
    });
};
Repository.prototype.getPermissionsByIDs = function (permissionIDs, callback) {
    // var repository = this;
    // var mongoDB;
    // async.waterfall([function (cb) {
    //     MongoClient.connect(repository.dBUrl, cb);
    // }, function (db, cb) {
    //     mongoDB = db;
    //     mongoDB.collection("permission").find({"permissionID": {"$in": permissionIDs}}, cb);
    // }, function(permissionDatas, cb) {
    //     var permissions = [];
    //     async.each(permissionDatas,
    //         function (permissionData, cb) {
    //             var permission;
    //             permission.permissionID = permissionData.permissionID;
    //             permission.permissions = [];
    //             permission = new Role(permission);
    //             if (!permissionData.permissionIDs) {
    //                 permissions.push(permission);
    //                 cb(null);
    //             } else {
    //                 repository.__permissionRepository__.getPermissionsByIDs(permissionIDs, function (err, permissions) {
    //                     if (err) {
    //                         cb(err);
    //                         return;
    //                     }
    //                     permission.permissions = permissions;
    //                     permissions.push(permission);
    //                 });
    //             }
    //         }, function (err) {
    //             if (err) {
    //                 callback(err, null);
    //                 mongoDB.close();
    //                 return;
    //             }
    //             cb(null, permissions);
    //         });
    // }], function (err, permissions) {
    //     console.log(permissions);
    //     if (err) {
    //         callback(err, null);
    //         mongoDB.close();
    //         return;
    //     }
    //     callback(null, permissions);
    //     mongoDB.close();
    // });
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        mongoDB.collection("permission").find({"permissionID": {"$in": permissionIDs}}).toArray(cb);
    }], function (err, documents) {
        if (err) {
            callback(err, null);
            mongoDB.close();
            return;
        }
        var permissions = [];
        for (var document of documents) {
            var permission = new Permission(document);
            permissions.push(permission);
        }
        callback(null, permissions);
        mongoDB.close();
    });
};
Repository.prototype.delPermissionByID = function (permissionID, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        mongoDB.collection('permission').deleteOne({"permissionID": permissionID}, cb);
    }], function (err, document) {
        if (err) {
            callback(err, false);
            mongoDB.close();
            return;
        }
        if (document.result.n == 0) {
            callback(err, false);
            mongoDB.close();
            return;
        }
        callback(null, true);
        mongoDB.close();
    });
};

module.exports = Repository;