FROM node:latest
MAINTAINER linmadan <772181827@qq.com>
COPY ./package.json /home/smartgrid-lessee/package.json
WORKDIR /home/smartgrid-lessee
RUN ["npm","config","set","registry" "http://registry.npm.taobao.org"]
RUN ["npm","install","--save-dev","mocha@2.5.3"]
RUN ["npm","install","--save-dev","muk@0.5.2"]
RUN ["npm","install","--save-dev","should@9.0.2"]
RUN ["npm","install","--save-dev","supertest@2.0.0"]
RUN ["npm","install","--save","async@2.0.0-rc.6"]
RUN ["npm","install","--save","body-parser@1.15.1"]
RUN ["npm","install","--save","multer@1.2.0"]
RUN ["npm","install","--save","express@4.13.4"]
RUN ["npm","install","--save","kafka-node@1.0.7"]
RUN ["npm","install","--save","mongodb@2.1.18"]
RUN ["npm","install","--save","request@2.73.0"]
RUN ["npm","install","--save","underscore@1.8.3"]
RUN ["npm","install","--save","gridvo-common-js@0.0.16"]
COPY ./app.js app.js
COPY ./lib lib
COPY ./test test
VOLUME ["/home/smartgrid-lessee"]
ENTRYPOINT ["node"]
CMD ["app.js"]