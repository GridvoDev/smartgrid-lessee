// 'use strict';
// const _ = require('underscore');
// const should = require('should');
// const muk = require('muk');
// const DataSourceService = require('../../../lib/application/service/dataSourceService');
//
// describe('dataSource service use case test', ()=> {
//     let service;
//     before(()=> {
//         service = new DataSourceService();
//     });
//     describe('#registerDataSource(dataSource, traceContext, callback)//callback(err,isSuccess)', ()=> {
//         context('register and save dataSource', ()=> {
//             it('fail if no dataSource', done=> {
//                 let dataSource = {};
//                 service.registerDataSource(dataSource, {} , (err, isSuccess)=> {
//                     if (err) {
//                         done(err);
//                     }
//                     isSuccess.should.be.eql(false);
//                     done();
//                 });
//             });
//             it('success', done=> {
//                 let dataSource = {};
//                 dataSource.dataSourceID = "station-datatype-other";
//                 dataSource.dataSourceType = "dataSourceType";
//                 dataSource.lessee = "lesseeID";
//                 dataSource.station = "stationID";
//                 service.registerDataSource(dataSource, {}, (err, isSuccess)=> {
//                     if (err) {
//                         done(err);
//                     }
//                     isSuccess.should.be.eql(true);
//                     done();
//                 });
//             });
//         });
//     });
//     describe('#getDataSources(dataSourceID, traceContext, callback)//callback(err,datas)', ()=> {
//         context('get dataSource by id', ()=> {
//             it('should return null if no exits such dataSource', done=> {
//                 let dataSourceID = "noDataSourceID";
//                 service.getDataSources(dataSourceID, {}, (err, datas)=> {
//                     if (err) {
//                         done(err);
//                     }
//                     _.isNull(datas).should.be.eql(true);
//                     done();
//                 });
//             });
//             it('should return all if dataSourceID is ""', done=> {
//                 let dataSourceID = "";
//                 service.getDataSources(dataSourceID, {}, (err, datas)=> {
//                     if (err) {
//                         done(err);
//                     }
//                     datas.length.should.be.eql(1);
//                     done();
//                 });
//             });
//             it('should return a dataSource if success', done=> {
//                 let dataSourceID = "station-datatype-other";
//                 service.getDataSources(dataSourceID, {}, (err, datas)=> {
//                     if (err) {
//                         done(err);
//                     }
//                     datas.length.should.be.eql(1);
//                     done();
//                 });
//             });
//         });
//     });
//     describe('#delDataSource(dataSourceID, traceContext, callback)//callback(err,isSuccess)', ()=> {
//         context('del dataSource', ()=> {
//             it('fail if no exits such dataSource', done=> {
//                 let dataSourceID = "noDataSourceID";
//                 service.delDataSource(dataSourceID, {}, (err, isSuccess)=> {
//                     isSuccess.should.be.eql(false);
//                     done();
//                 });
//             });
//             it('success', done=> {
//                 let dataSourceID = "station-datatype-other";
//                 service.delDataSource(dataSourceID, {}, (err, isSuccess)=> {
//                     isSuccess.should.be.eql(true);
//                     done();
//                 });
//             });
//         });
//     });
// });