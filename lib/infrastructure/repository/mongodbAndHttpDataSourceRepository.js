'use strict';

const _ = require('underscore');
const {createMongoZipkinClient} = require('gridvo-common-js');
const async = require('async');
const {DataSource} = require('../../domain/lesseeAndMember');
const {tracer} = require('../../util');

class Repository {
    constructor() {
        this._dbName = "DataSource";
        this._collectionName = "DataSourceInfo";
        this._serviceName = "smartgrid-lessee";
    }

    saveDataSource(dataSource, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            let {dataSourceID, dataSourceType , station, lessee}=dataSource;
            let updateOperations = {
                dataSourceID,
                dataSourceType,
                station,
                lessee
            };
            collection.updateOne({
                    dataSourceID
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

    getDatasByDataSourceID(dataSourceID, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            if(dataSourceID){
                collection.aggregate([{
                    $match: {
                        dataSourceID
                    }
                }], (err, result) => {
                    if (err) {
                        callback(err, null);
                        db.close();
                        return;
                    }
                    if (result.length == 0) {
                        callback(null, null);
                        db.close();
                        return;
                    }
                    let datas = [];
                    for (let data of result) {
                        datas.push(data);
                    }
                    callback(null, datas);
                    db.close();
                });
            }
            else{
                collection.aggregate([], (err, result) => {
                    if (err) {
                        callback(err, null);
                        db.close();
                        return;
                    }
                    if (_.isNull(result)) {
                        callback(null, null);
                        db.close();
                        return;
                    }
                    let datas = [];
                    for (let data of result) {
                        datas.push(data);
                    }
                    callback(null, datas);
                    db.close();
                });
            }

        }).catch(err => {
            callback(err);
        });
    };


    deleteDataSource(dataSourceID, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            collection.deleteOne({dataSourceID}, {limit: 1}, (err, document) => {
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