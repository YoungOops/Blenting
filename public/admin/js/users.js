// // DOMContentLoaded 이벤트 리스너를 추가하여 문서가 로드되면 실행됩니다.
// document.addEventListener('DOMContentLoaded', function () {
//   // 드롭다운 필터 요소를 가져옵니다. 및 드롭다운 옵션을 설정합니다.
//   initializeDropdownFilters();
//   // 최초 페이지 로드 시 모든 사용자 데이터를 가져옵니다.
//   fetchAllUsers();
// });

// function initializeDropdownFilters() {
//   const dropdowns = document.querySelectorAll('select');

//   // 모든 드롭다운에 대해 이벤트 리스너를 추가합니다.
//   dropdowns.forEach(function (dropdown) {
//     dropdown.addEventListener('change', function (event) {
//       event.preventDefault();
//       const filterName = event.target.name;
//       const selectedFilter = event.target.value;
//       fetchFilteredUsers({ [filterName]: selectedFilter }); // 객체 형태로 필터를 전달합니다.
//     });
//   });

//   // 드롭다운에 옵션을 추가합니다.
//   addOptionsToDropdown('genderDropdown', createDropdownOptions(genderEnum));
//   // 나머지 드롭다운에도 동일하게 옵션 추가 코드를 넣으세요.
// }

// function fetchAllUsers() {
//   // 사용자 정보를 가져오는 코드 작성...
// }
// // Enum 객체를 정의합니다.
// const genderEnum = {
//   MALE: 'Male',
//   FEMALE: 'Female',
// };

// const heightEnum = {
//   CASE1: 'Case 1',
//   CASE2: 'Case 2',
//   CASE3: 'Case 3',
//   CASE4: 'Case 4',
//   CASE5: 'Case 5',
// };

// const figureEnum = {
//   SLIM: 'Slim',
//   MEDIUM: 'Medium',
//   PLUMP: 'Plump',
//   MUSCULAR: 'Muscular',
// };

// const wantEnum = {
//   HEIGHT: 'Height',
//   FIGURE: 'Figure',
//   MBTI: 'MBTI',
//   HOBBY: 'Hobby',
//   JOB: 'Job',
//   AGE: 'Age',
//   DISTRICT: 'District',
// };

// const mbtiEnum = {
//   SJ: 'SJ',
//   SP: 'SP',
//   NF: 'NF',
//   NT: 'NT',
// };

// // Enum 객체를 이용하여 드롭다운 옵션을 생성하는 함수입니다.
// function createDropdownOptions(enumObject) {
//   return Object.values(enumObject)
//     .map((value) => `<option value="${value.toUpperCase()}">${value}</option>`)
//     .join('');
// }

// // 원하는 드롭다운 메뉴에 옵션을 추가하는 함수입니다.
// // 드롭다운 아이디, 추가할 옵션.
// function addOptionsToDropdown(dropdownId, options) {
//   const selectElement = document.getElementById(dropdownId);
//   selectElement.innerHTML += options;
// }

// // 문서가 로드되면 실행됩니다.
// document.addEventListener('DOMContentLoaded', function () {
//   // 각 드롭다운에 해당하는 옵션을 추가합니다.
//   addOptionsToDropdown('genderDropdown', createDropdownOptions(genderEnum));
//   addOptionsToDropdown('heightDropdown', createDropdownOptions(heightEnum));
//   addOptionsToDropdown('figureDropdown', createDropdownOptions(figureEnum));
//   addOptionsToDropdown('want1Dropdown', createDropdownOptions(wantEnum));
//   addOptionsToDropdown('want2Dropdown', createDropdownOptions(wantEnum));
//   addOptionsToDropdown('want3Dropdown', createDropdownOptions(wantEnum));
//   addOptionsToDropdown('mbtiDropdown', createDropdownOptions(mbtiEnum));
// });

// // 필터링된 사용자 데이터를 가져오는 함수입니다.
// function fetchFilteredUsers(filter) {
//   const token =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOjUsInVzZXJJZCI6NSwiaWF0IjoxNzA2NjcwNjc5LCJleHAiOjE3MDY3NTcwNzl9.d0DmKGPUzp41wSOX78lNm8pgUNXS_eWjlxiQO5N5jU8';

//   // 각 드롭다운의 선택된 값을 가져옵니다.
//   const filters = {
//     gender: document.getElementById('genderDropdown').value,
//     height: document.getElementById('heightDropdown').value,
//     figure: document.getElementById('figureDropdown').value,
//     want1: document.getElementById('want1Dropdown').value,
//     want2: document.getElementById('want2Dropdown').value,
//     want3: document.getElementById('want3Dropdown').value,
//     mbti: document.getElementById('mbtiDropdown').value,
//   };
//   const queryString = Object.entries(filters)
//     .filter(([key, value]) => value !== '') // 빈 값은 제외합니다.
//     .map(([key, value]) => `${key}=${value}`)
//     .join('&');

//   const url = queryString
//     ? `/api/admin/allProfiles?${queryString}`
//     : '/api/admin/filterProfiles';

//   fetch(url, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       updateTable(data);
//     })
//     .catch((error) => console.error('Error:', error));
// }

// // 모든 사용자 데이터를 가져오는 함수입니다.

// // 테이블을 업데이트하는 함수입니다.
// function updateTable(data) {
//   const usersTable = document.getElementById('usersTable'); // html usersTable 테이블의 ID
//   const tbody = usersTable.querySelector('tbody');
//   tbody.innerHTML = ''; // 기존 tbody 내용을 비웁니다.

//   // 서버로부터 받은 데이터를 기반으로 테이블 행을 생성합니다.
//   data.forEach((user) => {
//     const tr = document.createElement('tr');
//     tr.innerHTML = `
//         <td>${user.id}</td>
//         <td>${user.height}</td>
//         <td>${user.gender}</td>
//         <td>${user.figure}</td>
//         <td>${user.want1}</td>
//         <td>${user.want2}</td>
//         <td>${user.want3}</td>
//         <td>${user.mbti}</td>
//         <td>${user.nickName}</td>
//       `;
//     tbody.appendChild(tr);
//   });
// }
