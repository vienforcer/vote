import http from 'http';
import path from 'path';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import MySQLHelper from './common/MySQLHelper';

import { initRouter } from './router';

const port = process.env.PORT || 10000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  cookie: { secure: true, maxAge: 60 * 60 * 24, httpOnly: true, path: '/' },
  secret: 'node-express-@!@#$',
  resave: false,
  saveUninitialized: false,
}));

const router = express.Router();


// console print request method and url path;
app.use(function (req, res, next) {
  const { method, url } = req;
  const date = new Date();

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization,token, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    console.log(date.toLocaleString(), '--> method:', method.toLowerCase(), url);
    next();
  }
})

// init router 
initRouter(app, router);


app.use('/', (req, res, next) => {
  res.statusCode = 404;
  res.send({ code: 404, msg: 'method not found' });
  next();
});

app.use(function (err, req, res, next) {
  if (res.locals) {
    res.locals.message = err.message;
    res.locals.error = err;
  }
  console.log('----------------------error----------');
  console.log(err);
  res.status(err.status || 500);
  res.send(JSON.stringify({ code: err.status || 500, msg: err.message }));
})


app.set('port', port);

const server = http.createServer(app);
server.listen(port);


server.on('error', (error) => {
  console.log('---------enter error info------------')
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// listening 
server.on('listening', () => {
  MySQLHelper.log('listening on http://127.0.0.1:' + port);

  MySQLHelper.log('connection mysql database.');

  MySQLHelper.init({
    connectionLimit: 10,
    host: 'xiaotuni.cn',
    port: 13306,
    user: 'vote',
    password: 'vote@!@#$',
    database: 'node_express_vote'
  })
})

process.on('unhandledRejection', (err, b, next) => {
  console.log('error', err.message);
  if (next) {
    next();
  }
});