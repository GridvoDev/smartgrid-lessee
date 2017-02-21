'use strict';
const _ = require('underscore');
const {createMongoZipkinClient} = require('gridvo-common-js');
const {Permission} = require('../../domain/roleAndPermission');
const {tracer} = require('../../util');

class Repository {
    constructor() {
        this._dbName = "Permission";
        this._collectionName = "PermissionInfo";
        this._serviceName = "smartgrid-lessee";
    }

    savePermission(permission, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            let {permissionID, permissionName}=permission;
            let updateOperations = {
                permissionID,
                permissionName
            };
            collection.updateOne({
                    permissionID
                },
                {
                    $set: updateOperations
                },
                {
                    upsert: true

                },
                (err, result) => {
                    if (err) {
                        callback(err);
                        db.close();
                        return;
                    }
                    if (result.result.n == 1) {
                        callback(null, true);
                    }
                    else {
                        callback(null, false);
                    }
                    db.close();
                });
        }).catch(err => {
            callback(err);
        });
    };

    getAllPermission(traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            collection.aggregate([],
                (err, result) => {
                if (err) {
                    callback(err, null);
                    db.close();
                    return;
                }
                let permissions = [];
                for (let document of result) {
                    let permission = new Permission(document);
                    permissions.push(permission);
                }
                callback(null, permissions);
                db.close();
            });
        }).catch(err => {
            callback(err);
        });
    };

    getPermissionByID(permissionID, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            collection.findOne({permissionID}, {limit: 1}, (err, result) => {
                    if (err) {
                        callback(err);
                        db.close();
                        return;
                    }
                    if (_.isNull(result)) {
                        callback(null, null);
                        db.close();
                        return;
                    }
                    callback(null, result);
                    db.close();
                });
        }).catch(err => {
            callback(err);
        });
    };

    delPermissionByID(permissionID, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            collection.deleteOne({permissionID}, {limit: 1}, (err, document) => {
                if (err) {
                    callback(err, false);
                    db.close();
                    return;
                }
                if (document.result.n == 0) {
                    callback(null, false);
                    db.close();
                    return;
                }
                callback(null, true);
                db.close();
            });
        }).catch(err => {
            callback(err);
        });
    };
}

module
    .exports = Repository;