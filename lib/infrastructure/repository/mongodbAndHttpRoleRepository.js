'use strict';
const _ = require('underscore');
const {createMongoZipkinClient} = require('gridvo-common-js');
const {Role, Permission} = require('../../domain/roleAndPermission');
const {tracer} = require('../../util');

class Repository {
    constructor() {
        this._dbName = "Role";
        this._collectionName = "RoleInfo";
        this._serviceName = "smartgrid-lessee";
    }
    saveRole(role, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            let {roleID, roleName, permissionIDs}=role;
            let updateOperations = {
                roleID,
                roleName,
                permissionIDs
            };
            collection.updateOne({
                    roleID
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
    }
    getRoleByID(roleID, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            collection.findOne({roleID}, {limit: 1}, (err, result) => {
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
                let role = new Role(result);
                callback(null, role);
                db.close();
            });
        }).catch(err => {
            callback(err);
        });
    }
    getRoles(traceContext, callback) {
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
                    let roles = [];
                    for (let document of result) {
                        let {roleID, roleName, permissionIDs} = document;
                        roles.push({roleID, roleName, permissionIDs});
                    }
                    callback(null, roles);
                    db.close();
                });
        }).catch(err => {
            callback(err);
        });
    };
    delRoleByID(roleID, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            collection.deleteOne({roleID}, {limit: 1}, (err, document) => {
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

module.exports = Repository;