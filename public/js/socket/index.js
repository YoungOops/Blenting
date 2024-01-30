//import io from '/node_modules/socket.io-client/dist/socket.io.js'; // html에서 cdn으로 로드되므로 여기서 import하지않아도 됨
let meetingSocket;
let coupleSocket;

// 조건을 만들기 위한 로직 필요
// meetingCurrentPage = 'meeting'; // 임시
// coupleCurrentPage = 'couple'; // 임시


// 1.무언가 이벤트 발생하는 함수에서 파라미터로 타입 집어넣어 주기

// 무언가 이벤트 발생 시 미팅방 생성 함수
const handleClick = async () => { // 
  try {

    // 2. 받아온 파라미터로 if문, 타입이 GROUP, COUPLE인지 확인
    // 3. 타입에 따른 옵션 넣어서 요청하기

    const url = "http://localhost:3000/api/meetings";
    const option = {
      method: 'GET',
      headers: {
        'type': 'COUPLE',
      },
    }

    
    // 아직은 meeting만 가능
    const response = await fetch(url/*, option*/)
      
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }

        const MeetingInfo = await response.json();

        console.log("클라이언트에서 MeetingInfo 확인", MeetingInfo);

        const roomId = MeetingInfo.meeting.id;

        return roomId;

  } catch (err) {
    console.error("알 수 없는 에러", err);
  }

}



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
const meeting = await handleClick();
console.log('meeting.roomId 확인 ', typeof meeting)

// meeting과 couple이 동시에 실행되기 때문에 조건을 걸어서 조건을 충족하는 하나만 실행
if (window.location.pathname === '/meeting') { // window.location.pathname => 브라우저의 현재 경로
  console.log('현재 페이지 확인', window.location.pathname)

  meetingSocket = io('http://localhost:3000/meeting',
    {
      //path: '/meeting',// namespace 나누었을 시 어떤 namespace와 연결 할지 경로 설정  path 옵션 : 동일한 서버에 여러개의 네임스페이스 사용 시
      query: {
        authorization: getUserInfo,
        roomId: meeting // 2024 01 29
      },
    });

  console.log('네임스페이스 연결 확인', meetingSocket.nsp)
}



if (window.location.pathname === '/couple') {
  console.log('현재 페이지 확인', window.location.pathname)
  coupleSocket = io('http://localhost:3000/couple', // namespace 나누었을 시 어떤 namespace와 연결 할지 경로 설정 풀 url : 
    {
      //path: '/couple',// namespace 나누었을 시 어떤 namespace와 연결 할지 경로 설정  path 옵션 : 동일한 서버에 여러개의 네임스페이스 사용 시
      query: {
        authorization: getUserInfo,
        roomId: `couple:${meeting}`
      },
    });

  console.log('네임스페이스 연결 확인', coupleSocket.nsp)


  console.log('Meeting Socket Query:', meetingSocket && meetingSocket.io.opts.query);
  console.log('Couple Socket Query:', coupleSocket && coupleSocket.io.opts.query);

}

export { meetingSocket, coupleSocket };