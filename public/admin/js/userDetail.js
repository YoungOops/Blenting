document.addEventListener('DOMContentLoaded', function () {
  // URL 쿼리 스트링에서 userId 값을 가져옵니다.
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');

  // 사용자 프로필 정보를 가져오는 함수
  fetchUserProfile(userId);
});

// 서버로부터 유저의 프로필 정보를 가져오는 함수
function fetchUserProfile(userId) {
  // fetch 요청에 필요한 인증을 위해 accessToken을 가져옵니다.
  const accessToken = localStorage.getItem('accessToken');

  // 해당 유저의 프로필 정보를 서버로부터 가져옵니다. (AdminController의 findProfile 메소드)
  fetch(`/api/admin/userDetail/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById('userId').innerText = data.id;
      //auths 테이블에서 include로 같이 가져온 데이터 프론트에 띄우기
      document.getElementById('userEmail').innerText = data.Auths.email;
      document.getElementById('userNickName').innerText = data.nickName;
      document.getElementById('userGender').innerText = data.gender;
      document.getElementById('userHeight').innerText = data.height;
      document.getElementById('userFigure').innerText = data.figure;
      document.getElementById('userWant1').innerText = data.want1;
      document.getElementById('userWant2').innerText = data.want2;
      document.getElementById('userWant3').innerText = data.want3;
      document.getElementById('userMbti').innerText = data.mbti;
      document.getElementById('userRole').innerText = data.role;
      document.getElementById('userDistrict').innerText = data.district;
      document.getElementById('userDescription').innerText = data.description;
      document.getElementById('userHobby').innerText = data.hobby;
      document.getElementById('userJob').innerText = data.job;
      document.getElementById('userAge').innerText = data.age;
      document.getElementById('userTicket').innerText = data.ticket;
      document.getElementById('userCreatedAt').innerText = data.createdAt;

      document.getElementById('detail').innerText =
        data.nickName + '님 상세 조회';
    })
    .catch((error) => {
      console.error('Error fetching user profile:', error);
    });
}
