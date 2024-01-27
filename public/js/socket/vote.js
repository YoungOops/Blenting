import { meetingSocket } from './index.js';

const select = document.getElementById('select');
const messages = document.getElementById('chat-messages');

select.addEventListener('change', (e) => {
    e.preventDefault();

    if (select.value) {

        // 클라이언트에서 서버로 이벤트 발송
        meetingSocket.emit('vote', { option: select.value });
        select.selectedIndex = 0;
    }
})

// 서버에서 온 이벤트 접수
socket.on('vote', (vote) => {

    // 서로 지목을 했을 때 결과를 저장하고 나타내줄 수 있는 모델을 만들고 표시 할 수 있게

    const item = document.createElement('li');
    item.textContent = `${vote.fromUserNickName} 가 ${vote.toUserNickName}을 투표`;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});


socket.on('announce', (vote) => {
    console.log("voted 확인", vote);
    const item = document.createElement('li');
    
    item.textContent = `${vote.fromUserNickName} 와 ${vote.toUserNickName}가 서로 지목했습니다!`
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
})