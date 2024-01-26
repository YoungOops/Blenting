

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
export const socket = io('http://localhost:3000', {
  query: {
    authorization: getUserInfo,
  },
});
