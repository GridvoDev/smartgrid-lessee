'use strict';
const EventEmitter = require('events');
const co = require('co');
const _ = require('underscore');
const async = require('async');
const {constant} = require('../util');
const {Lessee, LesseeInfo, WechatInfo} = require('../../domain/lesseeAndMember');
const {createLesseeRepository, createMemberRepository, createStationRepository} = require('../../infrastructure');

class Service {
    constructor() {
        this._lesseeRepository = createLesseeRepository();
        this._stationRepository = createStationRepository();
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
                return false;
            }
            let _lesseeData = {};
            _lesseeData.lesseeName = lesseeData.lesseeName;
            let _wechatData = {};
            _wechatData.corpID = lesseeData.corpID;
            _wechatData.isActived = false;
            let newlessee = {};
            newlessee.lesseeID = lesseeData.lesseeID;
            newlessee.lesseeInfo = new LesseeInfo(_lesseeData);
            newlessee.wechatInfo = new WechatInfo(_wechatData);
            newlessee = new Lessee(newlessee);
            let isSuccess = yield saveLessee(newlessee);
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
        function getLesseeFromRepository() {
            return new Promise((resolve, reject)=> {
                self._lesseeRepository.getLesseeByID(lesseeID, traceContext, (err, lessee)=> {
                    if (err) {
                        reject(err);
                        logger.error(lessee, traceContext);
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
                        logger.error(isSuccess, traceContext);
                    }
                    resolve(isSuccess);
                });
            });
        }

        function* addStationToLessee() {
            let lessee = yield getLesseeFromRepository();console.log(lessee);
            if (!lessee) {
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

    assignMemberToLesseeStation(lesseeID, stationID, memberID, traceContext, callback) {
        if (!lesseeID || !stationID || !memberID) {
            callback(null, false);
            return;
        }
        var self = this;
        let _station;
        let _member;
        async.waterfall([
            function (cb) {
                self._stationRepository.getStationByID(lesseeID, stationID, traceContext, cb);
            },
            function (station, cb) {
                if (!station) {
                    callback(null, false);
                    return;
                }
                _station = station;
                self._memberRepository.getMemberByID(memberID, traceContext, cb);
            },
            function (member, cb) {
                if (!member) {
                    callback(null, false);
                    return;
                }
                _member = member;
                _station.addMember(_member);
                self._stationRepository.saveStation(_station, traceContext, cb);
            }
        ], function (err, isSuccess) {
            if (err) {
                callback(err, false);
                return;
            }
            callback(null, isSuccess);
        });
    };

    obtainMemberDutyStations(memberID, traceContext, callback) {
        if (!memberID) {
            callback(null, null);
            return;
        }
        var self = this;
        async.waterfall([
            function (cb) {
                self._stationRepository.getAllStationsByMemberID(memberID, traceContext, cb);
            }
        ], function (err, stations) {
            if (err) {
                callback(err, null);
                return;
            }
            if (!stations) {
                callback(err, null);
                return;
            }
            let stationDatas = [];
            let stationData;
            for (let station of stations) {
                stationData = {};
                stationData.stationID = station.stationID;
                stationData.stationName = station.stationInfo.stationName;
                stationDatas.push(stationData);
            }
            callback(null, stationDatas);
        });
    };
};


module.exports = Service;
