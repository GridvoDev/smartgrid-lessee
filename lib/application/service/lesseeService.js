'use strict';
const EventEmitter = require('events');
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
        var self = this;
        var _lesseeData = {};
        _lesseeData.lesseeName = lesseeData.lesseeName;
        var _wechatData = {};
        _wechatData.corpID = "corpID";
        _wechatData.isActived = false;
        let lessee = {};
        lessee.lesseeID = lesseeData.lesseeID;
        lessee.lesseeInfo = new LesseeInfo(_lesseeData);
        lessee.wechatInfo = new WechatInfo(_wechatData);
        lessee = new Lessee(lessee);
        self._lesseeRepository.saveLessee(lessee, traceContext , (err, isSuccess)=> {
            if (err) {
                callback(err, false);
                return;
            }
            callback(null, isSuccess);
        });
    };
    changeCorpWechatActiveState(corpID, isActived, traceContext, callback) {
        if (!corpID || (isActived !== true && isActived !== false)) {
            callback(null, false);
            return;
        }
        var self = this;
        async.waterfall([
            function (cb) {
                self._lesseeRepository.getLesseeByCorpID(corpID, traceContext , cb);
            },
            function (lessee, cb) {
                if (!lessee) {
                    callback(null, false);
                    return;
                }
                if (isActived) {
                    lessee.inactive();
                } else {
                    lessee.active();
                }
                self._lesseeRepository.saveLessee(lessee, traceContext , cb);
            }
        ], function (err, isSuccess) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, isSuccess);
        });
    };

    addStationToLessee(lesseeID, stationData, traceContext, callback) {
        if (!lesseeID || !stationData || !stationData.stationID || !stationData.stationName) {
            callback(null, null);
            return;
        }
        var self = this;
        let stationID;
        async.waterfall([
            function (cb) {
                self._lesseeRepository.getLesseeByID(lesseeID, traceContext, cb);
            },
            function (lessee, cb) {
                if (!lessee) {
                    callback(null, null);
                    return;
                }
                var station = lessee.createStation(stationData);
                stationID = station.stationID;
                self._stationRepository.saveStation(station, traceContext, cb);
            }
        ], function (err, isSuccess) {
            if (err) {
                callback(err, null);
                return;
            }
            if (isSuccess) {
                callback(null, stationID);
            } else {
                callback(null, null);
            }
        });
    };

    delStationFromLessee(lesseeID, stationID, traceContext, callback) {
        if (!lesseeID || !stationID) {
            callback(null, false);
            return;
        }
        var self = this;
        async.waterfall([
            function (cb) {
                self._stationRepository.delStation(lesseeID, stationID, traceContext, cb);
            }
        ], function (err, isSuccess) {
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
