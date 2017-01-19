'use strict';
const _ = require('underscore');
const should = require('should');
const muk = require('muk');
const LesseeService = require('../../../lib/application/service/lesseeService');
const MockLesseeService = require('../../mock/application/service/lesseeService');

describe('lessee service use case test', ()=> {
    let service;
    before(()=> {
        service = new LesseeService();
        let mockLesseeService = new MockLesseeService();
        muk(service, "_lesseeService", mockLesseeService);
    });
    describe('#registerLessee(lesseeData, traceContext, callback)//callback(err,isSuccess)', ()=> {
        context('register and save lessee data', ()=> {
            it('fail if no lessee data', done=> {
                let lesseeData = null;
                service.registerLessee(lesseeData, {} , (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('fail if lessee data is illegal', done=> {
                let lesseeData = {};
                lesseeData.lesseeID = null;
                service.registerLessee(lesseeData, {} , (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('success', done=> {
                let lesseeData = {};
                lesseeData.lesseeID = "lesseeID";
                lesseeData.corpID = "corpID";
                lesseeData.lesseeName = "lesseeName";
                service.registerLessee(lesseeData, {}, (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#changeCorpWechatActiveState(cropID,isActived, traceContext, callback)//callback(err,isSuccess)', ()=> {
        context('change lessee active state', ()=> {
            it('fail if data is illegal', done=> {
                let corpID = null;
                service.changeCorpWechatActiveState(corpID, true, {} , (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('fail if no exits such lessee', done=> {
                let corpID = "noCorpID";
                service.changeCorpWechatActiveState(corpID, true, {} , (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('success', done=> {
                let corpID = "corpID";
                let isActived = true;
                service.changeCorpWechatActiveState(corpID, isActived, {} , (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#addStationToLessee(lesseeID,stationData, traceContext, callback)//callback(err,stationID)', ()=> {
        context('add station to lessee', ()=> {
            it('fail if no exits such lessee', done=> {
                let lesseeID = "noLesseeID";
                let stationData = {};
                stationData.stationID = "stationID";
                stationData.stationName = "stationName";
                service.addStationToLessee(lesseeID, stationData, {}, (err, stationID)=> {
                    _.isNull(stationID).should.be.eql(true);
                    done();
                });
            });
            it('fail if no station data', done=> {
                let lesseeID = "lesseeID";
                let stationData = {};
                service.addStationToLessee(lesseeID, stationData, {}, (err, stationID)=> {
                    _.isNull(stationID).should.be.eql(true);
                    done();
                });
            });
            it('success', done=> {
                let lesseeID = "lesseeID";
                let stationData = {};
                stationData.stationID = "stationID";
                stationData.stationName = "stationName";
                service.addStationToLessee(lesseeID, stationData, {}, (err, stationID)=> {
                    stationID.should.be.eql("stationID");
                    done();
                });
            });
        });
    });
    describe('#delStationFromLessee(lesseeID, stationID, traceContext, callback)//callback(err,isSuccess)', ()=> {
        context('del station from lessee', ()=> {
            it('fail if no exits such lessee', done=> {
                let lesseeID = "noLesseeID";
                let stationID = "stationID";
                service.delStationFromLessee(lesseeID, stationID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('fail if no exits such station', done=> {
                let lesseeID = "lesseeID";
                let stationID = "noStationID";
                service.delStationFromLessee(lesseeID, stationID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('success', done=> {
                let lesseeID = "lesseeID";
                let stationID = "stationID";
                service.delStationFromLessee(lesseeID, stationID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    // describe('#assignMemberToLesseeStation(lesseeID, stationID,memberID,callback)//callback(err,isSuccess)', ()=> {
    //     context('assign member to one station', ()=> {
    //         it('fail if no exits such lessee', done=> {
    //             let lesseeID = "noLesseeID";
    //             let stationID = "stationID";
    //             let memberID = "memberID";
    //             service.assignMemberToLesseeStation(lesseeID, stationID, memberID, (err, isSuccess)=> {
    //                 isSuccess.should.be.eql(false);
    //                 done();
    //             });
    //         });
    //         it('fail if no exits such station', done=> {
    //             let lesseeID = "lesseeID";
    //             let stationID = "noStationID";
    //             let memberID = "memberID";
    //             service.assignMemberToLesseeStation(lesseeID, stationID, memberID, (err, isSuccess)=> {
    //                 isSuccess.should.be.eql(false);
    //                 done();
    //             });
    //         });
    //         it('fail if no exits such member', done=> {
    //             let lesseeID = "lesseeID";
    //             let stationID = "stationID";
    //             let memberID = "noMemberID";
    //             service.assignMemberToLesseeStation(lesseeID, stationID, memberID, (err, isSuccess)=> {
    //                 isSuccess.should.be.eql(false);
    //                 done();
    //             });
    //         });
    //         it('success', done=> {
    //             let lesseeID = "lesseeID";
    //             let stationID = "stationID";
    //             let memberID = "memberID";
    //             service.assignMemberToLesseeStation(lesseeID, stationID, memberID, (err, isSuccess)=> {
    //                 isSuccess.should.be.eql(true);
    //                 done();
    //             });
    //         });
    //     });
    // });
    // describe('#obtainMemberDutyStations(memberID,callback)//callback(err,stationDatas)', ()=> {
    //     context('obtain the stations which the member in charge of', ()=> {
    //         it('fail if no exits such member', done=> {
    //             let memberID = "noMemberID";
    //             service.obtainMemberDutyStations(memberID, (err, stationDatas) {
    //                 _.isNull(stationDatas).should.be.eql(true);
    //                 done();
    //             });
    //         });
    //         it('success', done=> {
    //             let memberID = "memberID";
    //             service.obtainMemberDutyStations(memberID, (err, stationDatas) {
    //                 stationDatas.length.should.be.eql(1);
    //                 done();
    //             });
    //         });
    //     });
    // });
});