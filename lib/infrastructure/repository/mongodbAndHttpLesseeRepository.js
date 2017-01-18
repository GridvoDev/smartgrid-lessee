'use strict';

const _ = require('underscore');
const {createMongoZipkinClient} = require('gridvo-common-js');
const async = require('async');
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
        mongoClient.then(({db, collection})=> {
            let {lesseeID, lesseeInfo, wechatInfo, isActived}=lessee;
            let updateOperations = {
                lesseeID,
                lesseeInfo,
                wechatInfo,
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
                (err, result)=> {
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
        }).catch(err=> {
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
        mongoClient.then(({db, collection})=> {
            collection.findOne({lesseeID}, {limit: 1}, (err, document)=> {
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
        }).catch(err=> {
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
        mongoClient.then(({db, collection})=> {
            collection.findOne({'wechatInfo._corpID' : corpID}, {limit: 1}, (err, document)=> {
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
        }).catch(err=> {
            callback(err);
        });
    };
}
module.exports = Repository;