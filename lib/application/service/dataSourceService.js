'use strict';
const EventEmitter = require('events');
const co = require('co');
const _ = require('underscore');
const async = require('async');
const {constant} = require('../util');
const {DataSource} = require('../../domain/lesseeAndMember');
const {createDataSourceRepository} = require('../../infrastructure');
const {logger} = require('../../util');

class Service {
    constructor() {
        this._dataSourceRepository = createDataSourceRepository();
    }

    registerDataSource(dataSource, traceContext, callback) {
        if (!dataSource || !dataSource.dataSourceID || !dataSource.lessee || !dataSource.station || !dataSource.dataSourceType) {
            callback(null, false);
            return;
        }
        let self = this;

        function getDataSourceFromRepository() {
            return new Promise((resolve, reject)=> {
                self._dataSourceRepository.getDatasByDataSourceID(dataSource.dataSourceID, traceContext, (err, data)=> {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            });
        }

        function saveDataSource(data) {
            return new Promise((resolve, reject)=> {
                self._dataSourceRepository.saveDataSource(data, traceContext, (err, isSuccess)=> {
                    if (err) {
                        reject(err);
                    }
                    resolve(isSuccess);
                });
            });
        }

        function* registerDataSource() {
            let data = yield getDataSourceFromRepository();
            if (data) {
                logger.error("this dataSource exist", traceContext);
                return false;
            }
            let newDataSource = {};
            newDataSource.dataSourceID = dataSource.dataSourceID;
            newDataSource.dataSourceType = dataSource.dataSourceType;
            newDataSource.station = dataSource.station;
            newDataSource.lessee = dataSource.lessee;
            newDataSource = new DataSource(newDataSource);
            let isSuccess = yield saveDataSource(newDataSource);
            return isSuccess
        };
        co(registerDataSource).then((isSuccess)=> {
            callback(null, isSuccess);
        }).catch(err=> {
            callback(err);
        });
    };

    delDataSource(dataSourceID, traceContext, callback) {
        if (!dataSourceID) {
            callback(null, false);
            return;
        }
        var self = this;
        self._dataSourceRepository.deleteDataSource(dataSourceID, traceContext, (err, isSuccess)=> {
            if (err) {
                callback(err, false);
                return;
            }
            callback(null, isSuccess);
        });
    };

    getDataSources(dataSourceID, traceContext, callback) {
        var self = this;
        self._dataSourceRepository.getDatasByDataSourceID(dataSourceID, traceContext, (err, dataSource)=> {
            if (err) {
                logger.error("this dataSource no exist", traceContext);
                callback(err, null);
                return;
            }
            callback(null, dataSource);
        });
    };
};


module.exports = Service;
