'use strict';
const co = require('co');
const _ = require('underscore');
const async = require('async');
const {Lessee, LesseeInfo, WechatInfo} = require('../../domain/lesseeAndMember');
const {createLesseeRepository, createMemberRepository, createStationRepository} = require('../../infrastructure');
const {logger} = require('../../util');

class Service {
    constructor() {
        this._lesseeRepository = createLesseeRepository();
        this._stationRepository = createStationRepository();
        this._memberRepository = createMemberRepository();
    }

    registerLessee(lesseeData, traceContext, callback) {
        if (!lesseeData || !lesseeData.lesseeID || !lesseeData.lesseeName || !lesseeData.corpID) {
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
        let self = this;
        let stationID;
        function getLessee() {
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
            let lessee = yield getLessee();
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

    getLessee(lesseeID, traceContext, callback) {
        let self = this;
        self._lesseeRepository.getLesseeByID(lesseeID, traceContext, (err, lessee)=> {
            if (err) {
                logger.error("this lessees no exist", traceContext);
                callback(err, null);
                return;
            }
            if(!lessee){
                callback(null, null);
            }
            let {lesseeID, lesseeInfo:{lesseeName}, wechatInfo:{corpID, corpIsActived}, isActived} = lessee;
            callback(null, {lesseeID, lesseeInfo:{lesseeName}, wechatInfo:{corpID, corpIsActived}, isActived});
        });
    };

    getLessees(traceContext, callback) {
        let self = this;
        self._lesseeRepository.getLessees(traceContext, (err, result)=> {
            if (err) {
                logger.error("this lessees no exist", traceContext);
                callback(err, null);
                return;
            }
            if(!result){
                callback(null, null);
            }
            let lessees = [];
            for (let lessee of result) {
                lessees.push(lessee);
            }
            callback(null, lessees);
        });
    };

    getStation(stationID, traceContext, callback) {
        var self = this;
        self._stationRepository.getStationByID(stationID, traceContext, (err, station)=> {
            if (err) {
                logger.error("this stations no exist", traceContext);
                callback(err, null);
                return;
            }
            if(!station){
                callback(null, null);
            }
            let {stationID, stationInfo:{stationName}, lesseeID, members} = station;
            callback(null, {stationID, stationInfo:{stationName}, lesseeID, members});
        });
    };

    getStations(traceContext, callback) {
        let self = this;
        self._stationRepository.getStations(traceContext, (err, stations)=> {
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
                stationsJSON.push(station);
            }
            callback(null, stationsJSON);
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
