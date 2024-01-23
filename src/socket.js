import { Server } from 'socket.io';

//함수 하나만 바로 익스포트 하기
export default function setupSocket(server) {
  //그냥 io 뉴 서버 해서 서버 인스턴스화 함 객체를 소프트웨어에 실체화 하면 그것을 ‘인스턴스’라고 부른다.
  const io = new Server(server);
  //setupSocket 함수는 내부적으로 new Server(server)를 호출하여 소켓 서버 인스턴스를 생성 app.js 에서 불러다가 쓸거임
  let users = new Set();

  io.on('connection', (socket) => {
    //이 유저는 어떤 이벤트를 가질 지 커넥션 했을 때 어떤식으로 값이 인식 되는지, 다음 이벤트는 어떻게 할 지 그런 걸 보면 됨
    console.log(socket.id); //gfz_FgBaSbVL9kTaAAAD 이런식으로 콘솔 찍힘.

    // 새 사용자의 입장을 모든 클라이언트에게 알립니다.
    users.add(socket.id);

    io.emit('entry', { id: socket.id, users: [...users] }); // 들어오면 모두에게 입장을 알림
    console.log('a user connected');
    // 사용자의 연결이 끊어졌을 때 처리합니다.
    socket.on('disconnect', () => {
      // 해당 사용자의 ID를 users Set에서 제거합니다.
      users.delete(socket.id);
      // 사용자의 퇴장을 모든 클라이언트에게 알립니다.
      io.emit('exit', { id: socket.id, users: [...users] });
      console.log('user disconnected');
    });

    //io.emit 함수를 사용하여 서버에 연결된 모든 클라이언트에게 이벤트를 방송하고 있습니다.
    //특정 클라이언트에게만 메시지를 보내려면 socket.emit을 사용할 수 있습니다.

    //현재 서버랑 모두랑 연결 되어있는건데, 한 유저가. 아래에 챗 이라는 이벤트를 일으키는 것이다. 그랬을 때 어떠한 일을 할 지 정의하는 것이다
    socket.on('chat message', (msg) => {
      io.emit('chat message', socket.id + ' ' + msg); // 한 클라이언트가 말하면 모두에게 msg를 알림
      console.log('message: ' + msg);
    });
  });

  return io;
}
