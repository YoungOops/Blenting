document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('로그인이 필요합니다.');
    window.location.href = '/signin.html';
    return;
  }

  try {
    const response = await fetch('/api/user/myPage', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    document.getElementById('detail').innerText =
      data.nickName + '님의 마이페이지 입니다.';

    // 사용자 정보를 DOM에 표시
    // document.getElementById('userId').innerText = data.id;
    document.getElementById('userEmail').innerText = data.Auths.email;
    document.getElementById('userNickName').innerText = data.nickName;
    document.getElementById('userGender').innerText = data.gender;
    document.getElementById('userHeight').innerText = data.height;
    document.getElementById('userFigure').innerText = data.figure;
    document.getElementById('userWant1').innerText = data.want1;
    document.getElementById('userWant2').innerText = data.want2;
    document.getElementById('userWant3').innerText = data.want3;
    document.getElementById('userMbti').innerText = data.mbti;
    // document.getElementById('userRole').innerText = data.role;
    document.getElementById('userDistrict').innerText = data.district;
    document.getElementById('userDescription').innerText = data.description;
    document.getElementById('userHobby').innerText = data.hobby;
    document.getElementById('userJob').innerText = data.job;
    document.getElementById('userAge').innerText = data.age;
    document.getElementById('userTicket').innerText = data.ticket;
    document.getElementById('userCreatedAt').innerText = data.createdAt;
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }

  document.getElementById('myPageSubmit').addEventListener('click', () => {
    window.location.href = '/profile.html'; // 프로필 수정 페이지로 이동
  });
});
