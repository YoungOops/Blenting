import { ClickMatchingButton } from './socket/index.js';

// 버튼 클릭 이벤트 리스너 등록
const signinButton = document.getElementById('signin');
const signupButton = document.getElementById('signup');
const matchingButton = document.getElementById('match');
const signoutButton = document.getElementById('signout');
const paymentButton = document.getElementById('payment');

const myPageButton = document.getElementById('myPage');

const accessToken = localStorage.getItem('accessToken');

signupButton.addEventListener('click', () => {
  window.location.href = '/signup.html';
});

signinButton.addEventListener('click', () => {
  window.location.href = '/signin.html';
});

signoutButton.addEventListener('click', () => {
  localStorage.removeItem('accessToken');
  window.location.href = '/index.html';
});

paymentButton.addEventListener('click', () => {
  window.location.href = '/payment.html';
});

myPageButton.addEventListener('click', () => {
  window.location.href = '/myPage.html';
});

document.addEventListener('DOMContentLoaded', () => {
  if (accessToken) {
    signupButton.style.display = 'none';
    signinButton.style.display = 'none';
    signoutButton.style.display = 'block';
    paymentButton.style.display = 'block';
    matchingButton.style.display = 'block';
    matchingButton.style.display = 'block';
    myPageButton.style.display = 'block';
  } else {
    signupButton.style.display = 'block';
    signinButton.style.display = 'block';
    signoutButton.style.display = 'none';
    paymentButton.style.display = 'none';
    matchingButton.style.display = 'none';
    myPageButton.style.display = 'none';
  }
});

matchingButton.addEventListener('click', async () => {
  if (!accessToken) {
    alert('로그인이 필요합니다.');
    return;
  }

  // 티켓이 없을 시 입장 불가
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`api/user/profile`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  const userInfo = await response.json();

  console.log("userInfo 확인", userInfo)

  if (userInfo.ticket === 0) {

    alert("티켓이 없습니다");

  } else {

    ClickMatchingButton('GROUP');
 
  }


});
