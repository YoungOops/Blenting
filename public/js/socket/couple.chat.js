import { coupleSocket } from './index.js';


/** HTML 문서에서 form, input, messages, userList 요소를 찾아 변수에 할당합니다. */
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('chat-messages');
const userList = document.getElementById('user-list');

if (!coupleSocket || typeof coupleSocket.on !== 'function') {
  console.error('coupleSocket is not defined or not a Socket');

} else {
  
  console.log("Couple socket 연결 상태: ", coupleSocket.connected);

  /** form 요소에 'submit' 이벤트 리스너를 추가합니다.
 * 제출 버튼 클릭 시 form의 기본 동작(페이지 새로고침)을 막고, 입력된 메시지를 서버로 전송합니다. */
  form.addEventListener('submit', (e) => {
    try{

      e.preventDefault(); // 기본 이벤트 동작을 막습니다.
    // input 필드에 값이 있는지 확인합니다.
    if (input.value) {
      coupleSocket.emit('couple chat message', input.value); //'chat message' 이벤트와 메시지 내용을 서버로 전송합니다.
      //샌드 후에 (엔터 치면) 공백이 되도록 한다.
      input.value = ''; // 메시지를 전송한 후 input 필드를 비웁니다.
    }

    } catch (error){
      console.error('submit 에러', error);
    }
    
  });
  //4번
  /** "서버로부터" 'entry' 이벤트를 받으면,
   * 새로운 사용자가 입장했음을 알리는 메시지를 화면에 표시합니다. */
  coupleSocket.on('couple entry', (data) => {
    try {

      console.log(data);
    const item = document.createElement('li'); // 새로운 'li' 요소를 생성합니다.
    item.textContent = data.me + '님이 couple방에 입장 하였습니다.'; // 'li' 요소에 텍스트를 추가합니다.
    messages.appendChild(item); // 'li' 요소를 messages 리스트에 추가합니다.
    messages.scrollTop = messages.scrollHeight; // 메시지 목록을 가장 아래로 스크롤합니다.

    /** 사용자 목록을 업데이트합니다. */
    userList.innerHTML = ''; // 기존 목록을 지우고 새로 시작합니다.
    console.log('클라이언트 couple entry 확인')

    // 서버에서 전달받은 사용자 배열을 순회합니다.
    data.users.forEach((e) => {
      const user = document.createElement('li'); // 각 사용자에 대한 'li' 요소를 생성합니다.
      user.textContent = e; // 'li' 요소에 사용자 ID를 텍스트로 추가합니다.
      userList.appendChild(user); // 'li' 요소를 userList에 추가합니다.
    });

    } catch(error){
      console.error('couple entry 에러', error);
    }
    
  });

  /** 서버로부터 'exit' 이벤트를 받으면 사용자의 퇴장 메시지를 화면에 표시합니다. */
  coupleSocket.on('couple exit', (data) => {
    try{

      const item = document.createElement('li'); // 새로운 'li' 요소를 생성합니다.
    item.textContent = data.me + '님이 퇴장 하였습니다.'; // 퇴장 메시지를 설정합니다.
    messages.appendChild(item); // 메시지 목록에 퇴장 메시지를 추가합니다.
    messages.scrollTop = messages.scrollHeight; // 메시지 목록을 가장 아래로 스크롤합니다.

    // 사용자 목록을 업데이트합니다.
    userList.innerHTML = ''; // 기존 목록을 지우고 새로 시작합니다.
    data.users.forEach((e) => {
      // 업데이트된 사용자 배열을 순회합니다.
      const user = document.createElement('li'); // 각 사용자에 대한 'li' 요소를 생성합니다.
      user.textContent = e; // 'li' 요소에 사용자 ID를 텍스트로 추가합니다.
      userList.appendChild(user); // 'li' 요소를 userList에 추가합니다.
    });

    } catch (error){

      console.error("couple exit 에러", error);

    }
    
  });

  // 서버로부터 'chat message' 이벤트를 받으면 메시지를 화면에 표시합니다.
  coupleSocket.on('couple chat message', (msg) => {
    try{

      console.log("소켓 msg 확인", msg)
    const item = document.createElement('li'); // 새로운 'li' 요소를 생성합니다.
    item.textContent = `${msg.socketUser}: ${msg.message}`; // 메시지 내용을 'li' 요소의 텍스트로 설정합니다.
    messages.appendChild(item); // 메시지 목록에 'li' 요소를 추가합니다.
    messages.scrollTop = messages.scrollHeight; // 메시지 목록을 가장 아래로 스크롤합니다.
    console.log('클라이언트 couple chat message 확인')

    } catch(error){
      console.error("couple chat message 에러", error);
    }
    
  });

  // /** 서버로부터 'chat message' 이벤트를 받으면 메시지를 화면에 표시합니다. */
  // socket.on('chat message', (msg) => {
  //   const item = document.createElement('li'); // 새로운 'li' 요소를 생성합니다.
  //   item.textContent = msg; // 메시지 내용을 'li' 요소의 텍스트로 설정합니다.
  //   messages.appendChild(item); // 메시지 목록에 'li' 요소를 추가합니다.
  //   messages.scrollTop = messages.scrollHeight; // 메시지 목록을 가장 아래로 스크롤합니다.
  // });


}

