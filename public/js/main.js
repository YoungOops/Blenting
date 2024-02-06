import { ClickMatchingButton } from './socket/index.js';

// 버튼 클릭 이벤트 리스너 등록
const signinButton = document.getElementById('signin');
const signupButton = document.getElementById('signup');
const matchingButton = document.getElementById('match');
const signoutButton = document.getElementById('signout');
const profileButton = document.getElementById('profile');
const accessToken = localStorage.getItem('accessToken');

signupButton.addEventListener('click', () => {
  window.location.href = server + '/signup.html';
});

signinButton.addEventListener('click', () => {
  window.location.href = server + '/signin.html';
});

signoutButton.addEventListener('click', () => {
  localStorage.removeItem('accessToken');
  window.location.href = server + '/main.html';
});

profileButton.addEventListener('click', () => {
  window.location.href = server + '/profile.html';
});

document.addEventListener('DOMContentLoaded', () => {
  if (accessToken) {
    signupButton.style.display = 'none';
    signinButton.style.display = 'none';
    signoutButton.style.display = 'block';
    profileButton.style.display = 'block';
    matchingButton.style.display = 'block';
  } else {
    signupButton.style.display = 'block';
    signinButton.style.display = 'block';
    signoutButton.style.display = 'none';
    profileButton.style.display = 'none';
    matchingButton.style.display = 'none';
  }
});

matchingButton.addEventListener('click', () => {
  if (!accessToken) {
    alert('로그인이 필요합니다.');
    return;
  }
  ClickMatchingButton('GROUP');
});
