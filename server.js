import bodyParser from 'body-parser';
import config from 'config';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import session from 'express-session';
import morgan from 'morgan';

import actionRouter from './routers/action.js';
import boardRouter from './routers/board.js';
import dellRouter from './routers/dell.js';
import groupRouter from './routers/group.js';
import itemRouter from './routers/item.js';
import pillarRouter from './routers/pillar.js';
import userRouter from './routers/user.js';
import microsoftRouter from './routers/microsoft.js';
import socketRouter from './routers/socket.js';

import socketIO from 'socket.io';
import http from 'http';

import model from './models/index.js';

const app = express();

app.use(morgan(':method :status :url :response-time'));

app.use(session({
  secret: config.get('server.sessionSecret'),
  resave: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
  saveUninitialized: true,
}));

const isAuthenticated = (req, res, next) => {
  if (!req.session.me) {
    res.status(403).send('Nice Try! May be Try Login Instead.');
  } else {
    model.User.update(
      { last: new Date() },
      { where: { id: req.session.me.id } },
    );
    next();
  }
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/dell', dellRouter);
app.use('/microsoft', microsoftRouter);

app.use('/socket', isAuthenticated, socketRouter);
app.use('/actions', isAuthenticated, actionRouter);
app.use('/boards', isAuthenticated, boardRouter);
app.use('/groups', isAuthenticated, groupRouter);
app.use('/items', isAuthenticated, itemRouter);
app.use('/pillars', isAuthenticated, pillarRouter);
app.use('/users', isAuthenticated, userRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
app.use(express.static('dist'));

const port = process.env.PORT || 8080;
// server.listen(port, () => {
//   console.warn('Xetro is listenning on port:', port);
// });

const server = http.createServer(app);
const io = socketIO(server);

let interval;

io.on('connection', (socket) => {
  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => getApiAndEmit(socket), 1000);

  socket.on('disconnect', () => {
    clearInterval(interval);
  })
});

server.listen(port, () => console.log(`listening on port ${port}`));

const getApiAndEmit = socket => {
  const response = new Date();
  socket.emit('FromAPI', response);
}


export default server;
