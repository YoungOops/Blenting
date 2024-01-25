//로그인 이후에 1번
export const socket = io('http://localhost:3000', {
  query: {
    authorization:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTcwNjE0NDc5NywiZXhwIjoxNzA2MjMxMTk3fQ.80l-aQpBx2KL5Hv8wLylUiv_b4GLjqo_Lk-oCAJPvmo',
  },
});
