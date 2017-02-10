'use strict';
const _ = require('underscore');
const async = require('async');
const MongoClient = require('mongodb').MongoClient;
const should = require('should');
const {Station, StationInfo} = require('../../../lib/domain/lesseeAndMember');
const MongodbStationRepository = require('../../../lib/infrastructure/repository/mongodbStationRepository');

describe('station repository MongoDB use case test', ()=> {
    let repository;
    before(()=> {
        repository = new MongodbStationRepository();
    });
    describe('#saveStation(station, traceContext, callback)//callback(err,isSuccess)', ()=> {
        context('save an station', ()=> {
            it('should return true if save success', (done)=> {
                var station = {};
                station.stationID = "stationID";
                station.stationInfo = new StationInfo({stationName: "stationName"});
                station.lesseeID = "lesseeID";
                station.members = ["memberID", "memberID2"];
                station = new Station(station);
                repository.saveStation(station, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getStationByID(lesseeID, stationID, traceContext, callback)//callback(err,station)', ()=> {
        context('get an station for id', ()=> {
            it('should return null if no this lessee', (done)=> {
                var lesseeID = "noLesseeID";
                var stationID = "stationID";
                repository.getStationByID(lesseeID, stationID, {}, (err, station)=> {
                    _.isNull(station).should.be.eql(true);
                    done();
                });
            });
            it('should return null if no this station', (done)=> {
                var lesseeID = "lesseeID";
                var stationID = "noStationID";
                repository.getStationByID(lesseeID, stationID, {}, (err, station)=> {
                    _.isNull(station).should.be.eql(true);
                    done();
                });
            });
            it('should return station if success', (done)=> {
                var lesseeID = "lesseeID";
                var stationID = "stationID";
                repository.getStationByID(lesseeID, stationID, {}, (err, station)=> {
                    station.stationID.should.be.eql('stationID');
                    station.stationInfo._stationName.should.be.eql('stationName');
                    station.lesseeID.should.be.eql('lesseeID');
                    station.members.should.be.eql(["memberID", "memberID2"]);
                    done();
                });
            });
        });
    });
    describe('#getStationsByID(stationID, traceContext, callback)//callback(err,stations)', ()=> {
        context('get stations by id', ()=> {
            it('should return null if no exits such station', done=> {
                let stationID = "noStationID";
                repository.getStationsByID(stationID, {}, (err, stations)=> {
                    if (err) {
                        done(err);
                    }
                    _.isNull(stations).should.be.eql(true);
                    done();
                });
            });
            it('should return a station if stationID is "stationID"', done=> {
                let stationID = "stationID";
                repository.getStationsByID(stationID, {}, (err, stations)=> {
                    if (err) {
                        done(err);
                    }
                    stations.length.should.be.eql(1);
                    done();
                });
            });
            it('should return all if stationID is ""', done=> {
                let stationID = "";
                repository.getStationsByID(stationID, {}, (err, stations)=> {
                    if (err) {
                        done(err);
                    }
                    stations.length.should.be.eql(1);
                    done();
                });
            });
        });
    });
    // describe('#getAllStationsByMemberID(memberID, traceContext, callback)//callback(err,stations)', ()=> {
    //     context('get all stations by memberID', ()=> {
    //         it('should return null if no this memberID', (done)=> {
    //             var memberID = "nomemberID";
    //             repository.getAllStationsByMemberID(memberID, {}, (err, stations)=> {
    //                 stations.length.should.be.eql(0);
    //                 done();
    //             });
    //         });
    //         it('should return station if exist this memberID', (done)=> {
    //             var memberID = "memberID2";
    //             repository.getAllStationsByMemberID(memberID, {}, (err, stations)=> {
    //                 stations.length.should.be.eql(1);
    //                 stations[0].stationID.should.be.eql('stationID');
    //                 done();
    //             });
    //         });
    //         it('should return all station if member take change of more station', (done)=> {
    //             var station1 = {};
    //             station1.stationID = "stationID1";
    //             station1.stationInfo = {};
    //             station1.stationInfo.name = "stationName";
    //             station1.lesseeID = "lesseeID1";
    //             station1.members = ["memberID", "memberID3"];
    //             station1 = new Station(station1);
    //             repository.saveStation(station1, ()=> {
    //                 var memberID = "memberID";
    //                 repository.getAllStationsByMemberID(memberID, {}, (err, stations)=> {
    //                     stations.length.should.be.eql(2);
    //                     done();
    //                 });
    //             });
    //         });
    //     });
    // });
    describe('#delStation(lesseeID, stationID, traceContext, callback)//callback(err,isSuccess)', ()=> {
        context('remove an account of id', ()=> {
            it('should return null if no this account', (done)=> {
                var lesseeID = "noLesseeID";
                var stationID = "stationID";
                repository.delStation(lesseeID, stationID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('should return null if no this account', (done)=> {
                var lesseeID = "lesseeID";
                var stationID = "noStationID";
                repository.delStation(lesseeID, stationID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('should return true if del one station', (done)=> {
                var lesseeID = "lesseeID";
                var stationID = "stationID";
                repository.delStation(lesseeID, stationID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    after(done=> {
        let {MONGODB_SERVICE_HOST = "127.0.0.1", MONGODB_SERVICE_PORT = "27017"}= process.env;
        MongoClient.connect(`mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/Station`, (err, db)=> {
            if (err) {
                done(err);
                return;
            }
            db.collection('StationInfo').drop((err, response)=> {
                db.close();
                done();
            });
        });
    });
});
