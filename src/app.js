import express from 'express'; // Express.js 라이브러리
import dotenv from 'dotenv';
dotenv.config();

import { Server } from 'socket.io'; //
//import http from 'http';
import { createServer } from 'http'; // Node.js 기본 HTTP 서버 모듈
import { fileURLToPath } from 'url'; // Node.js 모듈. URL을 파일 경로로 변환하는 데 사용
import { dirname, join } from 'path'; // Node.js 모듈. 디렉토리 이름과 경로를 조작하는 데 사용
import setupSocket from './socket/index.js'; // Socket.io 설정 모듈
import cors from 'cors'; // CORS 설정 라이브러리

import { apiRouter } from './routes/index.js'; // API 라우터 모듈
import cookieParser from 'cookie-parser'; // 쿠키 파싱 라이브러리
import LogMiddleware from './middlewares/log.middleware.js'; // 로깅 미들웨어 모듈
import ErrorHandlingMiddleware from './middlewares/error-handling.middleware.js';
import { startCron } from './cron/index.js'; // 5초 후 미팅방 자동삭제

// 현재 실행 중인 모듈의 파일 경로와 디렉토리 이름을 얻습니다
const __filename = dirname(fileURLToPath(import.meta.url));
const __dirname = dirname(__filename);

// Express 앱을 생성합니다
const app = express();
const PORT = 3000;

const httpServer = createServer(app);

// 미들웨어를 설정합니다
app.use(express.json()); // JSON 요청 본문 파싱
app.use(cors()); // CORS 설정

app.use(express.urlencoded({ extended: true })); // URL-encoded 요청 본문 파싱
app.set('view engine', 'html'); // 뷰 엔진을 HTML로 설정

// '/frontend' 경로로 정적 파일 제공 -> 퍼블릭으로 이름 바꾸기
app.use(express.static(join(__dirname, 'public')));

// 서버 응답에 MIME 타입을 설정
app.use(
  '/socket.io',
  express.static(join(__dirname, '..', 'node_modules', 'socket.io', 'dist')),
); // Socket.io 클라이언트 라이브러리 제공

/** 백오피스 admin 라우터 */
// 이 동작은 페이지를 서빙하기 위한 것이므로, API 라우터와는 별개로 작동해야 합니다.
app.use('/admin', express.static(join(__dirname, 'public', 'admin')));

// 라우트를 설정합니다 meeting네임스페이스
app.get('/meeting', (req, res) => {
  // 루트 경로에 대한 GET 요청 처리
  res.sendFile(join(__dirname, 'public', 'chat.html')); // 'index.html' 파일을 응답으로 전송
});

// 라우트를 설정합니다 couple네임스페이스
app.get('/couple', (req, res) => {
  // 루트 경로에 대한 GET 요청 처리
  res.sendFile(join(__dirname, 'public', 'chat.html')); // 'index.html' 파일을 응답으로 전송
});

// 미들웨어를 설정합니다
app.use('/api', apiRouter); // '/api' 경로로 들어오는 요청에 API 라우터 적용

app.use(cookieParser()); // 쿠키 파싱
app.use(LogMiddleware); // 로깅
app.use(ErrorHandlingMiddleware);

// HTTP 서버를 생성하고, Socket.io 서버를 설정합니다
setupSocket(httpServer);

//app.use 처럼 io.use

// cron 미팅방 자동 삭제
//startCron();

// 서버를 시작합니다
httpServer.listen(PORT, () => {
  console.log(`${PORT} 포트로 서버가 열렸어요!`);
});
