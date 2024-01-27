import { io } from 'socket.io-client';


const getUserToken = () => {

  
  // localStorage에서 accessToken을 가져옴 (문자열 상태)
  const token = localStorage.getItem('accessToken');
  console.log("index.js에서 토큰 확인", token);

  // // 가져온 accessToken(문자열)을 Json으로 파싱
  // const jsonParse = JSON.parse(token);

  // // 토큰 추출
  // const extractToken = jsonParse.value;
  // console.log("토큰 추출확인", extractToken)

  return token;
}

const getUserInfo = getUserToken();

//로그인 이후에 1번
export const meetingSocket = io('http://localhost:3000', 
{path:'/meeting',// namespace 나누었을 시 어떤 namespace와 연결 할지 경로 설정  path 옵션 : 동일한 서버에 여러개의 네임스페이스 사용 시
  query: {
    authorization: getUserInfo,
  },
});

export const coupleSocket = io('http://localhost:3000', // namespace 나누었을 시 어떤 namespace와 연결 할지 경로 설정 풀 url : 
{ path:'/couple',// namespace 나누었을 시 어떤 namespace와 연결 할지 경로 설정  path 옵션 : 동일한 서버에 여러개의 네임스페이스 사용 시
  query: {
    authorization: getUserInfo,
  },
});
