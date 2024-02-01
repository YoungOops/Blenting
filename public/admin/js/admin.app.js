// Enum 객체 정의
const genderEnum = {
  MALE: 'Male',
  FEMALE: 'Female',
};
const heightEnum = {
  CASE1: 'Case1',
  CASE2: 'Case2',
  CASE3: 'Case3',
  CASE4: 'Case4',
  CASE5: 'Case5',
};
const figureEnum = {
  SLIM: 'Slim',
  MEDIUM: 'Medium',
  PLUMP: 'Plump',
  MUSCULAR: 'Muscular',
};
const wantEnum = {
  HEIGHT: 'Height',
  FIGURE: 'Figure',
  MBTI: 'MBTI',
  HOBBY: 'Hobby',
  JOB: 'Job',
  AGE: 'Age',
  DISTRICT: 'District',
};
const mbtiEnum = {
  SJ: 'SJ',
  SP: 'SP',
  NF: 'NF',
  NT: 'NT',
};

// 페이지 로드 시 실행되는 기능을 초기화합니다.
document.addEventListener('DOMContentLoaded', function () {
  initializeDropdownFilters();
  fetchAllUsers();
});

function setupDropdownEventListeners() {
  const dropdowns = document.querySelectorAll('select');
  dropdowns.forEach(function (dropdown) {
    dropdown.addEventListener('change', function () {
      fetchFilteredUsers();
    });
  });
}

function addDropdownOptions() {
  addOptionsToDropdown('genderDropdown', createDropdownOptions(genderEnum));
  addOptionsToDropdown('heightDropdown', createDropdownOptions(heightEnum));
  addOptionsToDropdown('figureDropdown', createDropdownOptions(figureEnum));
  addOptionsToDropdown('want1Dropdown', createDropdownOptions(wantEnum));
  addOptionsToDropdown('want2Dropdown', createDropdownOptions(wantEnum));
  addOptionsToDropdown('want3Dropdown', createDropdownOptions(wantEnum));
  addOptionsToDropdown('mbtiDropdown', createDropdownOptions(mbtiEnum));
}

function addOptionsToDropdown(dropdownId, options) {
  const selectElement = document.getElementById(dropdownId);
  selectElement.innerHTML = options;
}

function createDropdownOptions(enumObject) {
  return Object.values(enumObject)
    .map((value) => `<option value="${value.toUpperCase()}">${value}</option>`)
    .join('');
}

function fetchAllUsers() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.error('Access token is not found in localStorage');
    return; // 토큰이 없으면 함수를 종료합니다.
  }
  fetch('http://localhost:3000/api/admin/allUsers', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }) // 백엔드 서버에 /admin/allUsers 경로로 GET 요청을 보냅니다.
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // 응답을 JSON 형태로 파싱합니다.
    })
    .then((users) => {
      updateTable(users);
      console.log(users); // 가져온 사용자 데이터를 콘솔에 출력합니다.
      // 이후 필요한 작업을 수행합니다.
    })
    .catch((error) => {
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
    });
}

function fetchFilteredUsers() {
  console.log(
    '🚀 ~ fetchFilteredUsers ~ fetchFilteredUsers:',
    fetchFilteredUsers,
  );
  // 현재 설정된 드롭다운 값을 가져옵니다.
  const filters = {
    gender: document.getElementById('genderDropdown').value,
    height: document.getElementById('heightDropdown').value,
    figure: document.getElementById('figureDropdown').value,
    want1: document.getElementById('want1Dropdown').value,
    want2: document.getElementById('want2Dropdown').value,
    want3: document.getElementById('want3Dropdown').value,
    mbti: document.getElementById('mbtiDropdown').value,
  };
  // 필터링 쿼리 스트링을 생성합니다.
  const queryString = Object.entries(filters)
    .filter(([key, value]) => value !== '') // 빈 값은 제외합니다.
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&');
  // 필터링된 유저를 요청하는 URL을 구성합니다.
  const url = `http://localhost:3000/api/admin/filterProfiles?${queryString}`;
  // 서버로부터 필터링된 유저 데이터를 가져오고, 데이터가 있다면 테이블을 업데이트합니다.
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      updateTable(data); // 받아온 데이터로 테이블을 업데이트하는 함수
    })
    .catch((error) => {
      console.error('Error fetching filtered users:', error);
    });
}

//콘솔 찍어보기 실제로 되는지
function updateTable(data) {
  const usersTable = document.getElementById('usersTable'); // html usersTable 테이블의 ID
  const tbody = usersTable.querySelector('tbody');
  tbody.innerHTML = ''; // 기존 tbody 내용을 비웁니다.

  // 서버로부터 받은 데이터를 기반으로 테이블 행을 생성합니다.
  data.forEach((user) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.height}</td>
      <td>${user.gender}</td>
      <td>${user.figure}</td>
      <td>${user.want1}</td>
      <td>${user.want2}</td>
      <td>${user.want3}</td>
      <td>${user.mbti}</td>
      <td>${user.nickName}</td>
    `;
    tbody.appendChild(tr);
  });
}
function initializeDropdownFilters() {
  // 드롭다운을 초기화하고, 드롭다운 옵션을 추가합니다.
  addDropdownOptions();
  setupDropdownEventListeners();
}
