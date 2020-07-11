import express from 'express';
const router = express.Router();
import { VoteService, MySQLHelper } from '../server'

/**
 * @getClientIP
 * @desc 获取用户 ip 地址
 * @param {Object} req - 请求
 */
function getClientIP(req) {
  console.log(req.headers);
  console.log('-----------headers-----------------------');
  console.log('-ip address-------', req.connection.remoteAddress);
  console.log('-ip address-------', req.socket.remoteAddress);
  console.log('-ip address-------', req.connection.socket && req.connection.socket.remoteAddress);

  return req.headers['X-Real-IP'] ||
    req.headers['x-forwarded-for'] || //            判断是否有反向代理 IP
    req.connection.remoteAddress || //              判断 connection 的远程 IP
    req.socket.remoteAddress || //                  判断后端的 socket 的 IP
    req.connection.socket.remoteAddress;
};

router
  .get('/', async (request, response, next) => {
    try {
      const info = await VoteService.GetVoteInfo();
      response.send(info);
    } catch (ex) {
      MySQLHelper.log(ex.msg || ex);
      response.status(ex.status || 400).send({ code: 400, msg: ex.msg || ex })
    }
  })
  .post('/', async (request, response, next) => {
    try {
      const info = await VoteService.AddVoteInfo(request.body);
      response.send(info);
      // response.send({ ip: getClientIP(request) })
    } catch (ex) {
      MySQLHelper.log(ex.msg || ex);
      response.status(ex.status || 400).send({ code: 400, msg: ex.msg || ex })
    }
  })
  .put('/:id', async (request, response) => {
    try {
      const info = await VoteService.UpdateVoteInfo(request.params.id, request.body);
      response.json(info);
    } catch (ex) {
      MySQLHelper.log(ex.msg || ex);
      response.status(ex.status || 400).json({ code: 400, msg: ex.msg || ex })
    }
  })


export default router;