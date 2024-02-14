import { ClickMatchingButton, getSocket } from './index.js';

// 주소에 있는 퀘리스트링으로 넘어온 roomId를 받아서 getSocket에 파라미터로 넘겨주기
const url = new URLSearchParams(location.search);

const roomId = url.get('roomId');
const meetingType = url.get('meetingType');
export let meetingSocket;
let me;

if (meetingType === 'meeting') {
  meetingSocket = getSocket(meetingType, roomId);
}



/** HTML 문서에서 form, input, messages, userList 요소를 찾아 변수에 할당합니다. */
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('chat-messages');
const userList = document.getElementById('user-list');
const select = document.getElementById('select-vote-list');

console.log('meetingSocket type 확인 ', typeof meetingSocket);

if (!meetingSocket || typeof meetingSocket.on !== 'function') {
  console.error('meetingSocket is undefined or not a Socket');
} else {
  meetingSocket.on('connect', async () => {
    console.log('Meeting socket connected');
    console.log('Meeting socket 연결 상태: ', meetingSocket.connected);

    const token = localStorage.getItem('accessToken');

    // get에서 무언가를 전달 하고 싶을 때 쿼리스트링 사용
    // 남아있는 채팅방 확인 후 조건에 따라 생성 api
    const url = `/api/user/profile`;
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // 아직은 meeting만 가능
    const response = await fetch(url, option);

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    console.log('서버응답확인 ', response.headers);

    me = await response.json();

  });

  /** form 요소에 'submit' 이벤트 리스너를 추가합니다.
   * 제출 버튼 클릭 시 form의 기본 동작(페이지 새로고침)을 막고, 입력된 메시지를 서버로 전송합니다. */
  form.addEventListener('submit', (e) => {
    try {
      e.preventDefault(); // 기본 이벤트 동작을 막습니다.

      // input 필드에 값이 있는지 확인합니다.
      if (input.value) {
        //'chat message' 이벤트와 메시지 내용을 서버로 전송합니다.
        meetingSocket.emit('meeting chat message', input.value);

        //샌드 후에 (엔터 치면) 공백이 되도록 한다.
        input.value = ''; // 메시지를 전송한 후 input 필드를 비웁니다.
      }
    } catch (error) {
      console.error('submit 에러 ', error);
    }
  });
  //4번
  /** "서버로부터" 'entry' 이벤트를 받으면,
   * 새로운 사용자가 입장했음을 알리는 메시지를 화면에 표시합니다. */
  meetingSocket.on('entry', (data) => {
    try {
      const meetingId = data.meetingId;
      console.log(`${data.me} 미팅방 입장 확인`);
      console.log(data);
      console.log('------------------------------------');
      console.log(meetingSocket.id);
      console.log('------------------------------------');

      if (meetingId === roomId) {
        const item = document.createElement('div'); // 새로운 'li' 요소를 생성합니다.
        item.style =
          'margin: 10px; padding-left: 7px; padding-right: 7px; list-style-type: none; text-align: center; border-radius: 10px; background-color: rgb(255, 255, 255, 0.5);';
        item.textContent = data.me + '님이 meeting방에 입장 하였습니다.'; // 'li' 요소에 텍스트를 추가합니다.
        messages.appendChild(item); // 'li' 요소를 messages 리스트에 추가합니다.
        messages.scrollTop = messages.scrollHeight; // 메시지 목록을 가장 아래로 스크롤합니다.

        /** 사용자 목록을 업데이트합니다. */
        userList.innerHTML = ''; // 기존 목록을 지우고 새로 시작합니다.

        // 서버에서 전달받은 사용자 배열을 순회합니다.
        data.users.forEach((e) => {
          console.log('e 확인', e);
          const user = document.createElement('li'); // 각 사용자에 대한 'li' 요소를 생성합니다.
          user.style = 'list-style-type: none';
          user.textContent = e.nickName; // 'li' 요소에 사용자 ID를 텍스트로 추가합니다.
          userList.appendChild(user); // 'li' 요소를 userList에 추가합니다.
        });


        // 투표 목록
        // 채팅 참가 시 지목하기 select에 option 추가
        select.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.text = '지목하기';
        defaultOption.selected = true;
        select.append(defaultOption);

        // 2024 02 05

        // if(meetingSocket.id === data.socketId){
        // }


        // 나의 성별을 가지고 투표 목록 가공
        data.users.forEach((e) => {

          console.log("vote e 확인", e)

          if (me.gender !== e.gender) {
            const option = document.createElement('option');
            option.textContent = e.nickName;
            option.value = e.id;
            select.append(option);
          }
        })

      }
    } catch (error) {
      console.error('entry 에러', error);
    }
  });

  /** 서버로부터 'exit' 이벤트를 받으면 사용자의 퇴장 메시지를 화면에 표시합니다. */
  meetingSocket.on('exit', (data) => {
    try {
      const item = document.createElement('div'); // 새로운 'li' 요소를 생성합니다.
      item.style =
        'margin: 10px; padding-left: 7px; padding-right: 7px; list-style-type: none; text-align: center; border-radius: 10px; background-color: rgb(255, 255, 255, 0.5);';
      item.textContent = data.me + '님이 퇴장 하였습니다.'; // 퇴장 메시지를 설정합니다.
      messages.appendChild(item); // 메시지 목록에 퇴장 메시지를 추가합니다.
      messages.scrollTop = messages.scrollHeight; // 메시지 목록을 가장 아래로 스크롤합니다.

      // 사용자 목록을 업데이트합니다.
      userList.innerHTML = ''; // 기존 목록을 지우고 새로 시작합니다.
      console.log('exist data.users 확인 ', data.users);

      data.users.forEach((e) => {
        // 업데이트된 사용자 배열을 순회합니다.
        const user = document.createElement('li'); // 각 사용자에 대한 'li' 요소를 생성합니다.
        user.style = 'list-style-type: none';
        user.textContent = e.nickName; // 'li' 요소에 사용자 ID를 텍스트로 추가합니다.
        userList.appendChild(user); // 'li' 요소를 userList에 추가합니다.
      });

      // 투표 목록
      select.innerHTML = '';
      const defaultOption = document.createElement('option');
      defaultOption.text = '지목하기';
      defaultOption.selected = true;
      select.append(defaultOption);

      data.users.forEach((e) => {

        if (me.gender !== e.gender) {
          const option = document.createElement('option');
          option.textContent = e.nickName;
          option.value = e.id;
          select.append(option);
        }

      })

    } catch (error) {
      console.error('exit 에러 ', error);
    }
  });

  // 서버로부터 'chat message' 이벤트를 받으면 메시지를 화면에 표시합니다.
  meetingSocket.on('meeting chat message', (msg) => {
    try {
      console.log('소켓 msg 확인', msg);
      const item = document.createElement('div'); // 새로운 'li' 요소를 생성합니다.

      // 자신의 메세지는 오른쪽에서 생성
      if (meetingSocket.id === msg.socketId) {

        item.style.textAlign = 'right';

      }

      item.innerHTML = `<div class="messageUserName">${msg.socketUser}</div><span class="messageText">${msg.message}</span>`;

      // 자신일 경우 메세지 박스 배경을 노랗게 설정
      if (meetingSocket.id === msg.socketId) {

        // js로 선언한 것이 아니기 때문에 쿼리셀렉터 사용
        item.querySelector('.messageText').style.backgroundColor = 'yellow';
      }

      // item.textContent = `${msg.socketUser}${msg.message}`; // 메시지 내용을 'li' 요소의 텍스트로 설정합니다.
      messages.appendChild(item); // 메시지 목록에 'li' 요소를 추가합니다.
      messages.scrollTop = messages.scrollHeight; // 메시지 목록을 가장 아래로 스크롤합니다.
    } catch (error) {
      console.error('meeting chat message 에러', error);
    }
  });

  // /** 서버로부터 'chat message' 이벤트를 받으면 메시지를 화면에 표시합니다. */
  // socket.on('chat message', (msg) => {
  //   const item = document.createElement('li'); // 새로운 'li' 요소를 생성합니다.
  //   item.textContent = msg; // 메시지 내용을 'li' 요소의 텍스트로 설정합니다.
  //   messages.appendChild(item); // 메시지 목록에 'li' 요소를 추가합니다.
  //   messages.scrollTop = messages.scrollHeight; // 메시지 목록을 가장 아래로 스크롤합니다.
  // });

  // 지목하기
  select.addEventListener('change', (e) => {
    e.preventDefault();

    if (select.value) {

      // 클라이언트에서 서버로 이벤트 발송
      meetingSocket.emit('vote', { option: select.value, voteUserSocketId: meetingSocket.id });
      select.selectedIndex = 0;
    }
  })

  // 서버에서 온 이벤트 접수
  meetingSocket.on('vote', (vote) => {

    // 서로 지목을 했을 때 결과를 저장하고 나타내줄 수 있는 모델을 만들고 표시 할 수 있게

    const item = document.createElement('li');
    item.textContent = `${vote.fromUserNickName} 가 ${vote.toUserNickName}을 투표`;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  });


  meetingSocket.on('announce', (vote) => {
    console.log("voted 확인", vote);
    const item = document.createElement('li');

    item.textContent = `${vote.fromUser.nickName} 와 ${vote.toUser.nickName}가 서로 지목했습니다!`
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;

    // 서로 투표한 인원들 소개팅 방으로 이동
    if (meetingSocket.id === vote.fromSocketId || meetingSocket.id === vote.toSocketId) {

      const roomId = vote.coupleId
      window.location.href = `/couple?meetingType=couple&roomId=${roomId}`;

    }
  })
}
