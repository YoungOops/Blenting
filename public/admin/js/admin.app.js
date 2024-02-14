// Enum 객체 정의
const heightEnum = {
  CASE1: 'Case1',
  CASE2: 'Case2',
  CASE3: 'Case3',
  CASE4: 'Case4',
  CASE5: 'Case5',
  CASE6: 'Case6',
};
const genderEnum = {
  MALE: 'Male',
  FEMALE: 'Female',
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
  ESTJ: 'ESTJ',
  ESTP: 'ESTP',
  ESFJ: 'ESFJ',
  ESFP: 'ESFP',
  ENTJ: 'ENTJ',
  ENTP: 'ENTP',
  ENFJ: 'ENFJ',
  ENFP: 'ENFP',
  ISTJ: 'ISTJ',
  ISTP: 'ISTP',
  ISFJ: 'ISFJ',
  ISFP: 'ISFP',
  INTJ: 'INTJ',
  INTP: 'INTP',
  INFJ: 'INFJ',
  INFP: 'INFP',
};

// 페이지 로드 시 실행되는 기능을 초기화합니다.
document.addEventListener('DOMContentLoaded', function () {
  fetchAllUsers();
  initializeDropdownFilters();
});

let currentDropdownListener = null; // 미리 선언된 이벤트 리스너 참조

function setupDropdownEventListeners() {
  const dropdowns = document.querySelectorAll('select');
  dropdowns.forEach(function (dropdown) {
    // 기존에 설정된 리스너가 있다면 제거
    if (currentDropdownListener !== null) {
      dropdown.removeEventListener('change', currentDropdownListener);
    }
    // 현재 리스너를 currentDropdownListener 에 저장
    currentDropdownListener = function () {
      fetchFilteredUsers();
    };
    // 리스너를 추가
    dropdown.addEventListener('change', currentDropdownListener);
  });
}

//addOptionsToDropdown(dropdownId, options)를 호출하는데,
//여기서 dropdownId가 올바르게 전달되고 있는지, options가 올바르게 생성되고 있는지 확인해보세요.
function addDropdownOptions() {
  addOptionsToDropdown('genderDropdown', createDropdownOptions(genderEnum)); // genderDropdown에 성별 옵션 추가
  addOptionsToDropdown('heightDropdown', createDropdownOptions(heightEnum)); // heightDropdown에 키값 옵션 추가
  addOptionsToDropdown('figureDropdown', createDropdownOptions(figureEnum)); // figureDropdown에 체형 옵션 추가
  addOptionsToDropdown('want1Dropdown', createDropdownOptions(wantEnum)); // want1Dropdown에 원하는 옵션 추가
  addOptionsToDropdown('want2Dropdown', createDropdownOptions(wantEnum)); // want2Dropdown에 원하는 옵션 추가
  addOptionsToDropdown('want3Dropdown', createDropdownOptions(wantEnum)); // want3Dropdown에 원하는 옵션 추가
  addOptionsToDropdown('mbtiDropdown', createDropdownOptions(mbtiEnum)); // mbtiDropdown에 MBTI 옵션 추가
}

// 페이지네이션 컨트롤들을 업데이트하는 함수입니다.
function setupPagination(pageInfo, currentPage, pageSize) {
  // 페이지네이션 컨트롤 요소를 가져옵니다.
  const prevButton = document.getElementById('prev-page');
  const nextButton = document.getElementById('next-page');
  const currentPageSpan = document.getElementById('current-page');
  const totalPagesSpan = document.getElementById('total-pages');

  // 현재 페이지와 총 페이지 수를 업데이트합니다.
  currentPageSpan.textContent = pageInfo.currentPage;
  totalPagesSpan.textContent = pageInfo.totalPage;

  // 이전에 추가된 이벤트 리스너를 제거합니다. 리무브 이벤트 리스너로 바꾸기.
  if (prevPageHandler) {
    prevButton.removeEventListener('click', prevPageHandler);
  }
  if (nextPageHandler) {
    nextButton.removeEventListener('click', nextPageHandler);
  }

  // 새로운 리스너 함수를 정의합니다.
  prevPageHandler = function () {
    if (currentPage > 1) fetchAllUsers(currentPage - 1, pageSize);
  };
  nextPageHandler = function () {
    if (currentPage < pageInfo.totalPage)
      fetchAllUsers(currentPage + 1, pageSize);
  };

  // 새로 정의된 리스너를 이벤트에 연결합니다.
  prevButton.addEventListener('click', prevPageHandler);
  nextButton.addEventListener('click', nextPageHandler);

  // 버튼 활성화/비활성화 설정
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === pageInfo.totalPage;
}

function addOptionsToDropdown(dropdownId, options) {
  const selectElement = document.getElementById(dropdownId);
  // 디폴트 값을 만들어서 넣어주기... option....
  selectElement.innerHTML = '<option value="">All</option>' + options;
}

function createDropdownOptions(enumObject) {
  // enumObject의 값들을 대문자로 변환하여 옵션 태그로 만듦
  return Object.values(enumObject)
    .map((value) => `<option value="${value.toUpperCase()}">${value}</option>`) // 각 enumObject의 값을 대문자로 변환하여 옵션 태그로 만듦
    .join(''); // 생성된 옵션들을 문자열로 결합
}

function fetchAllUsers(pageNo = 1, countPerPage = 10) {
  // 액세스 토큰을 로컬 스토리지에서 가져옵니다.
  const token = localStorage.getItem('accessToken');
  // 토큰이 없는 경우 에러를 출력하고 함수를 종료합니다.
  if (!token) {
    console.error('Access token is not found in localStorage');
    return; // 토큰이 없으면 함수를 종료합니다.
  }
  // 백엔드 서버에서 모든 사용자를 가져오는 GET 요청을 보냅니다.
  // 쿼리로 서버에 카운트퍼페이지, 페이지넘버를 어떻게 넘겨주는지 알아보기
  fetch('/api/admin/allUsers', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // 헤더에 토큰을 포함시킵니다.
    },
  }) // 백엔드 서버에 /admin/allUsers 경로로 GET 요청을 보냅니다.
    .then((response) => {
      // 네트워크 응답이 정상적이지 않은 경우 에러를 throw합니다.
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // 응답을 JSON 형태로 파싱합니다.
      return response.json();
    })
    .then((response) => {
      console.log('🚀 ~ .then ~ response:', response);
      updateTable(response.data);
      // setupPagination 호출에 필요한 페이지 정보를 가져옵니다.
      setupPagination(
        response.pageInfo,
        response.pageInfo.currentPage,
        countPerPage,
      );
    })
    .catch((error) => {
      // fetch 작업에 문제가 있을 경우 에러를 출력합니다.
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
    });
}

//fetchFilteredUsers() 함수에서 필터링된 사용자 데이터를 요청하고 있는데, 이 함수가 제대로 동작하는지 확인
function fetchFilteredUsers() {
  // 현재 설정된 드롭다운 값을 가져와 filters 객체를 가져옴
  const filters = {
    gender: document.getElementById('genderDropdown').value, // 성별 드롭다운 값
    height: document.getElementById('heightDropdown').value, // 키값 드롭다운 값
    figure: document.getElementById('figureDropdown').value, // 체형 드롭다운 값
    want1: document.getElementById('want1Dropdown').value, // 원하는 옵션1 드롭다운 값
    want2: document.getElementById('want2Dropdown').value, // 원하는 옵션2 드롭다운 값
    want3: document.getElementById('want3Dropdown').value, // 원하는 옵션3 드롭다운 값
    mbti: document.getElementById('mbtiDropdown').value, // MBTI 드롭다운 값
  };
  console.log(filters); // filters 객체를 콘솔에 출력

  // 필터 객체를 기반으로 쿼리 스트링을 초기화합니다.
  const queryString = Object.entries(filters) // 이 부분에서 filters 객체를 키-값 쌍의 배열로 변환
    .filter(([_, value]) => value !== '') // 빈 값은 제외합니다.
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    ) // 각 키-값 쌍을 "키=값" 형태의 문자열로 변환
    .join('&'); // 각 문자열을 '&'로 연결하여 최종 쿼리 스트링을 생성

  console.log('🚀 ~ fetchFilteredUsers ~ queryString:', queryString);
  // 필터링된 유저를 요청하는 URL을 구성합니다.
  const url = `/api/admin/filterProfiles?${queryString}`;
  // 서버로부터 필터링된 유저 데이터를 가져오고, 데이터가 있다면 테이블을 업데이트합니다.
  console.log(url); // URL을 콘솔에 출력합니다.
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
      return response.json(); // 응답이 올바르면 JSON으로 파싱합니다.
    })
    .then((data) => {
      console.log(data); // 서버로부터 받은 데이터 로깅
      updateTable(data); // 받아온 데이터로 테이블을 업데이트하는 함수 호출
    })
    .catch((error) => {
      console.error('Error fetching filtered users:', error);
    });
}

// 서버로부터 받은 데이터를 기반으로 테이블을 업데이트하는 함수
function updateTable(data) {
  const usersTable = document.getElementById('usersTable'); // HTML에서 usersTable 테이블의 ID를 가져옴
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
      <td><button onclick="redirectToUserProfile(${user.id})">View Profile</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function initializeDropdownFilters() {
  // 드롭다운을 초기화하고, 드롭다운 옵션을 추가합니다.
  addDropdownOptions(); // 드롭다운 옵션을 추가
  setupDropdownEventListeners(); // 드롭다운 이벤트 리스너를 설정
  const searchButton = document.getElementById('searchButton');
  searchButton.addEventListener('click', function () {
    fetchFilteredUsers(); // 검색 버튼 클릭 시 필터링된 결과를 가져옵니다.
  });
}

function handleNextPage() {
  // 현재 페이지가 총 페이지 수보다 작을 때에만 다음 페이지로 이동합니다.
  if (currentPage < pageInfo.totalPage) {
    fetchAllUsers(currentPage + 1, pageSize);
  } else {
    // 아무 작업도 하지 않거나, 혹은 '마지막 페이지 입니다'와 같은 메시지를 표시합니다.
    console.log('This is the last page.');
  }
}
