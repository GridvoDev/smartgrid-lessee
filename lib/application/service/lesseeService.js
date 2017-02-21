'use strict';
const co = require('co');
const _ = require('underscore');
const async = require('async');
const {Lessee, LesseeInfo, WechatInfo, DataSource} = require('../../domain/lesseeAndMember');
const {createLesseeRepository, createMemberRepository, createDataSourceRepository, createStationRepository} = require('../../infrastructure');
const {logger} = require('../../util');

class Service {
    constructor() {
        this._lesseeRepository = createLesseeRepository();
        this._stationRepository = createStationRepository();
        this._dataSourceRepository = createDataSourceRepository();
        this._memberRepository = createMemberRepository();
    }

    registerLessee(lesseeData, traceContext, callback) {
        if (!lesseeData || !lesseeData.lesseeID || !lesseeData.lesseeName) {
            callback(null, false);
            return;
        }
        let self = this;

        function getLesseeFromRepository() {
            return new Promise((resolve, reject)=> {
                self._lesseeRepository.getLesseeByID(lesseeData.lesseeID, traceContext, (err, lessee)=> {
                    if (err) {
                        reject(err);
                    }
                    resolve(lessee);
                });
            });
        }

        function saveLessee(lessee) {
            return new Promise((resolve, reject)=> {
                self._lesseeRepository.saveLessee(lessee, traceContext, (err, isSuccess)=> {
                    if (err) {
                        reject(err);
                    }
                    resolve(isSuccess);
                });
            });
        }

        function* registerLessee() {
            let lessee = yield getLesseeFromRepository();
            if (lessee) {
                logger.error("this lessee exist", traceContext);
                return false;
            }
            let lesseeName = lesseeData.lesseeName;
            let corpID = lesseeData.corpID;
            let corpIsActived = false;
            let newLessee = {};
            newLessee.lesseeID = lesseeData.lesseeID;
            newLessee.lesseeInfo = new LesseeInfo({lesseeName});
            newLessee.wechatInfo = new WechatInfo({corpID,corpIsActived});
            newLessee = new Lessee(newLessee);
            let isSuccess = yield saveLessee(newLessee);
            return isSuccess
        };
        co(registerLessee).then((isSuccess)=> {
            callback(null, isSuccess);
        }).catch(err=> {
            callback(err);
        });
    };
    changeCorpWechatActiveState(corpID, isActived, traceContext, callback) {
        if (!corpID || (isActived !== true && isActived !== false)) {
            callback(null, false);
            return;
        }
        let self = this;
        function getLessee() {
            return new Promise((resolve, reject)=> {
                self._lesseeRepository.getLesseeByCorpID(corpID, traceContext , (err, lessee)=> {
                    if (err) {
                        reject(err);
                    }
                    resolve(lessee);
                });
            });
        };
        function saveLessee(lessee) {
            return new Promise((resolve, reject)=> {
                self._lesseeRepository.saveLessee(lessee, traceContext , (err, isSuccess)=> {
                    if (err) {
                        reject(err);
                    }
                    resolve(isSuccess);
                });
            });
        };
        function* changeWechatActiveState() {
            let lessee = yield getLessee();
            if (!lessee) {
                logger.error("this lessee no exist", traceContext);
                return false;
            }
            let isSuccess = yield saveLessee(lessee);
            return isSuccess;
        };
        co(changeWechatActiveState).then(isSuccess=> {
            callback(null, isSuccess);
        }).catch(err=> {
            callback(err);
        });
    };

    addStationToLessee(lesseeID, stationData, traceContext, callback) {
        if (!lesseeID || !stationData || !stationData.stationID || !stationData.stationName) {
            callback(null, null);
            return;
        }
        var self = this;
        var stationID;
        function getLessees() {
            return new Promise((resolve, reject)=> {
                self._lesseeRepository.getLesseeByID(lesseeID, traceContext, (err, lessee)=> {
                    if (err) {
                        reject(err);
                    }
                    resolve(lessee);
                });
            });
        }

        function saveStation(station) {
            return new Promise((resolve, reject)=> {
                self._stationRepository.saveStation(station, traceContext, (err, isSuccess)=> {
                    if (err) {
                        reject(err);
                    }
                    resolve(isSuccess);
                });
            });
        }

        function* addStationToLessee() {
            let lessee = yield getLessees();
            logger.info(lessee, traceContext);
            if (!lessee) {
                logger.error("this lessee no exist", traceContext);
                return null;
            }
            let station = lessee.createStation(stationData);
            stationID = station.stationID;
            let isSuccess = yield saveStation(station);
            return stationID
        };
        co(addStationToLessee).then((isSuccess)=> {
            if (isSuccess) {
                callback(null, stationID);
            } else {
                callback(null, null);
            }
        }).catch(err=> {
            callback(err);
        });
    };

    delStationFromLessee(lesseeID, stationID, traceContext, callback) {
        if (!lesseeID || !stationID) {
            callback(null, false);
            return;
        }
        var self = this;
        self._stationRepository.delStation(lesseeID, stationID, traceContext, (err, isSuccess)=> {
            if (err) {
                callback(err, false);
                return;
            }
            callback(null, isSuccess);
        });
    };

    delLessee(lesseeID, traceContext, callback) {
        if (!lesseeID) {
            callback(null, false);
            return;
        }
        var self = this;
        self._lesseeRepository.deleteLessee(lesseeID, traceContext, (err, isSuccess)=> {
            if (err) {
                callback(err, false);
                return;
            }
            callback(null, isSuccess);
        });
    };

    getLessees(lesseeID, traceContext, callback) {
        var self = this;
        self._lesseeRepository.getLesseesByID(lesseeID, traceContext, (err, lessees)=> {
            if (err) {
                logger.error("this lessees no exist", traceContext);
                callback(err, null);
                return;
            }
            if(!lessees){
                callback(null, null);
            }
            let lesseesJSON = [];
            for (let lessee of lessees) {console.log(lessee);
                //let {lesseeID,lesseeInfo:{lesseeName}, wechatInfo:{corpID,corpIsActived}, isActived} = lessee;
                //lesseesJSON.push({lesseeID, lesseeInfo:{lesseeName}, wechatInfo:{corpID,corpIsActived}, isActived});
                lesseesJSON.push(lessee);
            }
            callback(null, lesseesJSON);
        });
    };

    getStations(stationID, traceContext, callback) {
        var self = this;
        self._stationRepository.getStationsByID(stationID, traceContext, (err, stations)=> {
            if (err) {
                logger.error("this stations no exist", traceContext);
                callback(err, null);
                return;
            }
            if(!stations){
                callback(null, null);
            }
            let stationsJSON = [];
            for (let station of stations) {
                let {stationID, stationInfo, lesseeID, members} = station;
                stationsJSON.push({stationID, stationInfo, lesseeID, members});
            }
            callback(null, stationsJSON);
        });
    };
    registerDataSource(dataSource, traceContext, callback) {console.log(dataSource)
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
        self._dataSourceRepository.getDatasByDataSourceID(dataSourceID, traceContext, (err, dataSources)=> {
            if (err) {
                logger.error("this dataSource no exist", traceContext);
                callback(err, null);
                return;
            }
            if(!dataSources){
                callback(null, null);
            }
            let dataSourcesJSON = [];
            for (let dataSource of dataSources) {
                let {dataSourceID, dataSourceType, station, lessee} = dataSource;
                dataSourcesJSON.push({dataSourceID, dataSourceType, station, lessee});
            }
            callback(null, dataSourcesJSON);
        });
    };


    // assignMemberToLesseeStation(lesseeID, stationID, memberID, traceContext, callback) {
    //     if (!lesseeID || !stationID || !memberID) {
    //         callback(null, false);
    //         return;
    //     }
    //     var self = this;
    //     let _station;
    //     let _member;
    //     async.waterfall([
    //         function (cb) {
    //             self._stationRepository.getStationByID(lesseeID, stationID, traceContext, cb);
    //         },
    //         function (station, cb) {
    //             if (!station) {
    //                 callback(null, false);
    //                 return;
    //             }
    //             _station = station;
    //             self._memberRepository.getMemberByID(memberID, traceContext, cb);
    //         },
    //         function (member, cb) {
    //             if (!member) {
    //                 callback(null, false);
    //                 return;
    //             }
    //             _member = member;
    //             _station.addMember(_member);
    //             self._stationRepository.saveStation(_station, traceContext, cb);
    //         }
    //     ], function (err, isSuccess) {
    //         if (err) {
    //             callback(err, false);
    //             return;
    //         }
    //         callback(null, isSuccess);
    //     });
    // };
    //
    // obtainMemberDutyStations(memberID, traceContext, callback) {
    //     if (!memberID) {
    //         callback(null, null);
    //         return;
    //     }
    //     var self = this;
    //     async.waterfall([
    //         function (cb) {
    //             self._stationRepository.getAllStationsByMemberID(memberID, traceContext, cb);
    //         }
    //     ], function (err, stations) {
    //         if (err) {
    //             callback(err, null);
    //             return;
    //         }
    //         if (!stations) {
    //             callback(err, null);
    //             return;
    //         }
    //         let stationDatas = [];
    //         let stationData;
    //         for (let station of stations) {
    //             stationData = {};
    //             stationData.stationID = station.stationID;
    //             stationData.stationName = station.stationInfo.stationName;
    //             stationDatas.push(stationData);
    //         }
    //         callback(null, stationDatas);
    //     });
    // };
};


module.exports = Service;
