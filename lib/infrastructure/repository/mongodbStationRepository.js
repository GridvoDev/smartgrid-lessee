'use strict';

const _ = require('underscore');
const {createMongoZipkinClient} = require('gridvo-common-js');
const {Station} = require('../../domain/lesseeAndMember');
const {tracer} = require('../../util');

class Repository {
    constructor() {
        this._dbName = "Station";
        this._collectionName = "StationInfo";
        this._serviceName = "smartgrid-lessee";
    }

    saveStation(station, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            let {stationID, stationInfo:{stationName}, lesseeID, members}=station;
            let updateOperations = {
                stationID,
                stationInfo:{stationName},
                lesseeID,
                members
            };
            collection.updateOne({
                    stationID
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

    getStationByID(lesseeID, stationID, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            collection.findOne({lesseeID, stationID}, {limit: 1}, (err, document) => {
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
                let station = new Station(document);
                callback(null, station);
                db.close();
            });
        }).catch(err => {
            callback(err);
        });
    };

    delStation(lesseeID, stationID, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            collection.deleteOne({lesseeID, stationID}, {limit: 1}, (err, document) => {
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

    getAllStationsByMemberID(memberID, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            collection.findOne({memberID}, (err, documents) => {
                if (err) {
                    callback(err, null);
                    db.close();
                    return;
                }
                var stations = [];
                for (var document of documents) {
                    var station = new Station(document);
                    stations.push(station);
                }
                callback(null, stations);
                db.close();
            });
        }).catch(err => {
            callback(err);
        });
    };

    getStationsByID(stationID, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            if (stationID) {
                collection.aggregate([{
                        $match: {
                            stationID
                        }
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
                        let stations = [];
                        for (let document of result) {
                            let station = new Station(document);
                            stations.push(station);
                        }
                        callback(null, stations);
                        db.close();
                    });
            } else {
                collection.aggregate([],
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
                        let stations = [];
                        for (let document of result) {
                            let station = new Station(document);
                            stations.push(station);
                        }
                        callback(null, stations);
                        db.close();
                    });
            }
        }).catch(err => {
            callback(err);
        });
    }

}

module.exports = Repository;