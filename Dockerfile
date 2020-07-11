FROM node:12-alpine

RUN mkdir -p /workspace
COPY ./ /workspace
WORKDIR  /workspace
RUN npm install --registry=https://registry.npm.taobao.org
RUN npm install -g pm2 --registry=https://registry.npm.taobao.org

EXPOSE 3050
CMD ["pm2","start","pm2.json","--no-daemon"]