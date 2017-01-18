FROM node:latest
MAINTAINER linmadan <772181827@qq.com>
COPY ./package.json /home/smartgrid-lessee/package.json
WORKDIR /home/smartgrid-lessee
RUN ["npm","config","set","registry http://registry.npm.taobao.org"]
RUN ["npm","install","mocha@2.5.3"]
RUN ["npm","install","muk@0.5.2"]
RUN ["npm","install","should@9.0.2"]
RUN ["npm","install","supertest@2.0.0"]
RUN ["npm","install","async@2.0.0-rc.6"]
RUN ["npm","install","bearcat@0.4.29"]
RUN ["npm","install","body-parser@1.15.1"]
RUN ["npm","install","multer@1.2.0"]
RUN ["npm","install","express@4.13.4"]
RUN ["npm","install","kafka-node@1.0.7"]
RUN ["npm","install","mongodb@2.1.18"]
RUN ["npm","install","request@2.73.0"]
RUN ["npm","install","underscore@1.8.3"]
COPY ./app.js app.js
COPY ./lib lib
COPY ./test test
VOLUME ["/home/smartgrid-lessee"]
ENTRYPOINT ["node"]
CMD ["app.js"]