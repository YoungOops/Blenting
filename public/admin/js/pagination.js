// // 페이지네이션 컨트롤들을 업데이트하는 함수입니다.
// export function setupPagination(pageInfo, currentPage, pageSize) {
//   // 페이지네이션 컨트롤 요소를 가져옵니다.
//   const prevButton = document.getElementById('prev-page');
//   const nextButton = document.getElementById('next-page');
//   const currentPageSpan = document.getElementById('current-page');
//   const totalPagesSpan = document.getElementById('total-pages');

//   // 현재 페이지와 총 페이지 수를 업데이트합니다.
//   currentPageSpan.textContent = pageInfo.currentPage;
//   totalPagesSpan.textContent = pageInfo.totalPage;

//   // 이전에 추가된 이벤트 리스너를 제거합니다.
//   prevButton.removeEventListener('click', handlePrevPage);
//   nextButton.removeEventListener('click', handleNextPage);
//   // 이전 또는 다음 버튼이 클릭되었을 때 호출될 함수를 정의합니다.
//   function handlePrevPage() {
//     if (currentPage > 1) fetchAllUsers(currentPage - 1, pageSize);
//   }
//   function handleNextPage() {
//     if (currentPage < pageInfo.totalPage)
//       fetchAllUsers(currentPage + 1, pageSize);
//   }

//   // 새 이벤트 리스너를 추가합니다.
//   prevButton.addEventListener('click', handlePrevPage);
//   nextButton.addEventListener('click', handleNextPage);

//   prevButton.disabled = currentPage === 1;
//   nextButton.disabled = currentPage === pageInfo.totalPage;
// }
