//import io from '/node_modules/socket.io-client/dist/socket.io.js'; // html에서 cdn으로 로드되므로 여기서 import하지않아도 됨
// let meetingCurrentPage;
// let coupleCurrentPage;
let meetingSocket;
let coupleSocket;

// 조건을 만들기 위한 로직 필요
// meetingCurrentPage = 'meeting'; // 임시
// coupleCurrentPage = 'couple'; // 임시


// 2024 01 29 미팅 참여하기 버튼 클릭 시 
// const existMeetings = await prisma.meetings.findMany({
//   where: {
//     type:'GROUP'
//   }
// });
// if(!existMeetings.length) {
//   await prisma.meetings.create({
//     data:{},
//   })
// }

// const meeting = await prisma.meetings.findFirst({
//   where:{
//     type: 'GROUP',
//   }
// }) 같은 api 호출 할 수 있게
// res 에서 meeting.id 를 query로 가져와서 보내주기

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



// meeting과 couple이 동시에 실행되기 때문에 조건을 걸어서 조건을 충족하는 하나만 실행
if (window.location.pathname === '/meeting') { // window.location.pathname => 브라우저의 현재 경로
  console.log('현재 페이지 확인', window.location.pathname)

  meetingSocket = io('http://localhost:3000/meeting',
    {
      //path: '/meeting',// namespace 나누었을 시 어떤 namespace와 연결 할지 경로 설정  path 옵션 : 동일한 서버에 여러개의 네임스페이스 사용 시
      query: {
        authorization: getUserInfo,
        // 2024 01 29 roomId:`meeting:${meeting.id}`
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
        //roomId:`couple:${meeting.id}`
      },
    });

  console.log('네임스페이스 연결 확인', coupleSocket.nsp)


  console.log('Meeting Socket Query:', meetingSocket && meetingSocket.io.opts.query);
  console.log('Couple Socket Query:', coupleSocket && coupleSocket.io.opts.query);

}

export { meetingSocket, coupleSocket };