document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('main-btn').addEventListener('click', () => {
    window.location.href = '/index.html'; // 프로필 수정 페이지로 이동
  });

  document.getElementById('myPage').addEventListener('click', () => {
    window.location.href = '/myPage.html';
  });
});
