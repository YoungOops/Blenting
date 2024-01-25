//로그인 이후에 1번
export const socket = io('http://localhost:3000', {
  query: { authorization: 'JWTtoken' },
});
