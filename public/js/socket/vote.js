// import { getSocket } from './index.js';
import { meetingSocket } from './meeting.chat.js';

const url = new URLSearchParams(location.search);

const roomId = url.get('roomId');

// 2024 02 02 meeting.chat과 vote에서 접속이 되어 두 번 입장 되는듯
//const meetingSocket = getSocket('meeting', roomId);

const select = document.getElementById('select');
const messages = document.getElementById('chat-messages');

if (!meetingSocket || typeof meetingSocket.on !== 'function') {
    console.error('meetingSocket is undefined or not a Socket')
} else {

    select.addEventListener('change', (e) => {
        e.preventDefault();

        if (select.value) {

            // 클라이언트에서 서버로 이벤트 발송
            meetingSocket.emit('vote', { option: select.value });
            select.selectedIndex = 0;
        }
    })

    // 서버에서 온 이벤트 접수
    meetingSocket.on('vote', (vote) => {

        // 서로 지목을 했을 때 결과를 저장하고 나타내줄 수 있는 모델을 만들고 표시 할 수 있게

        const item = document.createElement('li');
        item.textContent = `${vote.fromUserNickName}님이 투표를 했습니다`;
        messages.appendChild(item);
        messages.scrollTop = messages.scrollHeight;
    });


    // meetingSocket.on('announce', (vote) => {
    //     console.log("voted 확인", vote);
    //     const item = document.createElement('li');

    //     item.textContent = `${vote.fromUserNickName} 와 ${vote.toUserNickName}가 서로 지목했습니다!`
    //     messages.appendChild(item);
    //     messages.scrollTop = messages.scrollHeight;
    // })
}

