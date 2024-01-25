import { MessagesRepository } from '../repositories/messages.repository.js';

const messagesRepository = new MessagesRepository();

//2번
let users = new Map();
// 메모리에 유저정보 저장하는건데 -> DB에 저장하는 방식으로 바꾸기
// js : Map, Set 찾아보기

export const handleChatEvent = (io, socket) => {
  // query 접근 시 handshake 사용 ex) socket.handshake.query.~~~
  console.log(socket.id); //socket.id => gfz_FgBaSbVL9kTaAAAD 이런식으로 생김.
  console.log('!@@@@@@@@@@@@@', socket.handshake.query.authorization);
  socket.user = { name: socket.handshake.query.authorization }; // 여기에 유저 인증 정보를 넣어줘야 함

  users.set(socket.id, socket.user); // 새 사용자의 입장을 모든 클라이언트에게 알립니다.
  //3번
  io.emit('entry', {
    id: socket.id,
    me: socket.user,
    users: Array.from(users.values()),
  }); // 들어오면 모두에게 입장을 알림 'entry', { 이게 데이터임 }
  console.log('a user connected');
  // 사용자의 연결이 끊어졌을 때 처리합니다.
  socket.on('disconnect', () => {
    // 해당 사용자의 ID를 users Set에서 제거합니다.
    users.delete(socket.id);
    // 사용자의 퇴장을 모든 클라이언트에게 알립니다.
    io.emit('exit', { id: socket.id, users: Array.from(users.values()) });
    console.log('user disconnected');
  });

  //io.emit 함수를 사용하여 서버에 연결된 모든 클라이언트에게 이벤트를 방송하고 있습니다.
  //특정 클라이언트에게만 메시지를 보내려면 socket.emit을 사용할 수 있습니다.

  /** 현재 서버와 모두가 연결이 되어있음, 챗 이벤트를 시작했을 때 어떠한 일을 할지 정의하는 코드 */
  //비동기 함수로 변경
  socket.on('chat message', async (msg) => {
    // 비동기 함수로 변경
    try {
      // 임시로 설정된 사용자 ID와 미팅 ID, 실제 환경에서는 인증 시스템을 통해 얻어야 함
      const userId = 1;
      const meetingId = 3;
      const socketId = socket.id;

      // MessagesRepository를 이용하여 메시지를 데이터베이스에 저장
      const newMessage = await messagesRepository.createMessage(meetingId, msg);

      // 메시지 저장 후 모든 클라이언트에게 메시지를 방송
      io.emit('chat message', { socketId, message: msg }); // 메시지 형식을 객체로 변경
      console.log('message: ', msg);
      // io.emit('chat message', socket.id + ' ' + msg); // 한 클라이언트가 말하면 모두에게 msg를 알림
    } catch (error) {
      // 에러 처리 로직
      console.error('Error saving message:', error);
      // 필요한 경우 에러를 클라이언트에게 전송
    }
  });
};
