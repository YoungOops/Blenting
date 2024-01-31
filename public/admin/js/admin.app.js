//DOM = 웹 페이지의 '요소들의 모음' 또는 '웹 페이지의 구조
//DOMContentLoaded 이벤트는 HTML 문서가 완전히 로드되고 파싱됐을 때 발생합니다.
//$(document).ready()와 유사한 작업을 수행하지만, 순수한 자바스크립트(바닐라 JS)를 사용
document.addEventListener('DOMContentLoaded', function () {
  // 'filterForm'이라는 ID를 가진 폼 요소를 가져옵니다.
  const form = document.getElementById('filterForm');
  // 'usersTable'이라는 ID를 가진 테이블 요소를 가져옵니다.
  const usersTable = document.getElementById('usersTable');

  // 폼의 'submit' 이벤트에 이벤트 리스너를 추가합니다.
  form.addEventListener('submit', function (event) {
    // 폼 제출의 기본 동작(페이지 새로고침 등)을 방지합니다.
    event.preventDefault();
    // 폼 내의 데이터를 새 FormData 객체로 생성합니다.
    const formData = new FormData(form);
    // FormData 객체를 URLSearchParams로 변환하고 쿼리 스트링으로 변환합니다.
    const query = new URLSearchParams(formData).toString();
    // fetch API를 사용하여 서버에 요청을 보냅니다.

    // 여기서는 '/api/users' 엔드포인트에 쿼리 스트링을 추가합니다.
    fetch(`/api/user/allProfiles?${query}`)
      .then((response) => response.json()) // 응답을 JSON 형태로 파싱합니다.
      .then((data) => {
        // 테이블의 <tbody> 요소를 선택합니다.
        const tbody = usersTable.querySelector('tbody');
        tbody.innerHTML = ''; // 기존의 <tbody> 내용을 비웁니다.
        // 서버로부터 받은 데이터를 기반으로 테이블 행을 생성합니다.
        data.forEach((user) => {
          const tr = document.createElement('tr'); // 새로운 행 요소를 생성합니다.
          tr.innerHTML = `
                <td>${user.id}</td> // 유저 ID를 테이블 데이터 셀에 넣습니다.
                <td>${user.figure}</td> // 유저 체형을 테이블 데이터 셀에 넣습니다.
                <!-- 여기에 추가 유저 데이터 셀을 넣을 수 있습니다. -->
              `;
          tbody.appendChild(tr); // 생성된 행을 <tbody>에 추가합니다.
        });
      })
      .catch((error) => console.error('Error:', error)); // 오류 콘솔 로그 남기기
  });
});
