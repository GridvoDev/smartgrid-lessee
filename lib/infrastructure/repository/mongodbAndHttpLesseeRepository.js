'use strict';

const _ = require('underscore');
const {createMongoZipkinClient} = require('gridvo-common-js');
const {Lessee, LesseeInfo, WechatInfo} = require('../../domain/lesseeAndMember');
const {tracer} = require('../../util');

class Repository {
    constructor() {
        this._dbName = "Lessee";
        this._collectionName = "LesseeInfo";
        this._serviceName = "smartgrid-lessee";
    }

    saveLessee(lessee, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            let {lesseeID, lesseeInfo:{lesseeName}, wechatInfo:{corpID,corpIsActived}, isActived}=lessee;
            let updateOperations = {
                lesseeID,
                lesseeInfo:{lesseeName},
                wechatInfo:{corpID,corpIsActived},
                isActived
            };
            collection.updateOne({
                    lesseeID
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

    getLesseeByID(lesseeID, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            collection.findOne({lesseeID}, {limit: 1}, (err, document) => {
                if (err) {
                    callback(err, null);
                    db.close();
                    return;
                }
                if (_.isNull(document)) {
                    callback(null, null);
                    db.close();
                    return;
                }
                let lessee = new Lessee(document);
                callback(null, lessee);
                db.close();
            });
        }).catch(err => {
            callback(err);
        });
    };

    getLesseeByCorpID(corpID, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            collection.findOne({'wechatInfo.corpID': corpID}, {limit: 1}, (err, document) => {
                if (err) {
                    callback(err, null);
                    db.close();
                    return;
                }
                if (_.isNull(document)) {
                    callback(null, null);
                    db.close();
                    return;
                }
                let lessee = new Lessee(document);
                callback(null, lessee);
                db.close();
            });
        }).catch(err => {
            callback(err);
        });
    };

    getLesseesByID(lesseeID, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            if (lesseeID) {
                collection.aggregate([{
                        $match: {lesseeID}
                    }],
                    (err, result) => {
                        if (err) {
                            callback(err);
                            db.close();
                            return;
                        }
                        if (result.length == 0) {
                            callback(null, null);
                            db.close();
                            return;
                        }
                        let lessees = [];
                        for (let document of result) {
                            let {lesseeID,lesseeInfo:{lesseeName}, wechatInfo:{corpID,corpIsActived}, isActived} = document;
                            lessees.push({lesseeID,lesseeInfo:{lesseeName}, wechatInfo:{corpID,corpIsActived}, isActived});
                        }
                        callback(null, lessees);
                        db.close();
                    });
            }
            else {
                collection.aggregate([], (err, result) => {
                    if (err) {
                        callback(err);
                        db.close();
                        return;
                    }
                    if (result.length == 0) {
                        callback(null, null);
                        db.close();
                        return;
                    }
                    let lessees = [];
                    for (let document of result) {
                        let {lesseeID,lesseeInfo:{lesseeName}, wechatInfo:{corpID,corpIsActived}, isActived} = document;
                        lessees.push({lesseeID,lesseeInfo:{lesseeName}, wechatInfo:{corpID,corpIsActived}, isActived});
                    }
                    callback(null, lessees);
                    db.close();
                });
            }
        }).catch(err => {
            callback(err);
        });
    }

    deleteLessee(lesseeID, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            collection.deleteOne({lesseeID}, {limit: 1}, (err, document) => {
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