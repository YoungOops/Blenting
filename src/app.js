// src/app.js

import express from 'express';
import {apiRouter} from './routes/index.js';
import cookieParser from 'cookie-parser';
// cookie-parse 모듈은 요청된 쿠키를 쉽게 사용할 수 있도록 도와주는 모듈이당

import LogMiddleware from './middlewares/log.middleware.js';
import ErrorHandlingMiddleware from './middlewares/error-handling.middleware.js';

const app = express();
const PORT = 3000;
// 이거는 RDS 포트랑 왜 다른가요?

//app.use 얘네가 다 미들웨어임 전역미들웨어 등록 되는 거임.
app.use(express.json());
app.use('/api', apiRouter);
app.use(cookieParser());

app.use(LogMiddleware);
app.use(ErrorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
