import { Server } from 'socket.io';
import http from 'http';
import { meetingHandleChatEvent } from './meeting.chat.js';
import { coupleHandleChatEvent } from './couple.chat.js';
import { MembersRepository} from '../repositories/members.repository.js';
import { handleVoteEvent } from './vote.js';

const membersRepository = new MembersRepository();

export default function setupSocket(server) {

  const io = new Server(server);

  // namespace 나누기 
  const meeting = io.of('/meeting'); 
  const couple = io.of('/couple'); 



  meeting.on('connection', (socket) => {

    // socket => 실행 시점에 연결한 상대와 연결된 소켓의 객체

    console.log('Meeting Room Connection:', socket.rooms);
    console.log('Meeting Socket Query:', socket.handshake.query);
    console.log("socket.handshake.query.roomId 확인 ", socket.handshake.query.roomId);

    
    // 클라이언트에서 받은 roomId를 사용하여 해당 룸에 소켓을 조인시킴
    socket.join(socket.handshake.query.roomId);  // 클라이언트에서 roomId가져오게 되었을 시 받아오기
    meetingHandleChatEvent(meeting, socket);
    handleVoteEvent(meeting, socket);
  });

  couple.on('connection', (socket) => {
    console.log('------------------------------------');
    console.log('Couple Room Connection:', socket.rooms);
    console.log('Couple Socket Query:', socket.handshake.query);
    console.log('------------------------------------');
    


    //socket.join('coupleRoom');
    socket.join(socket.handshake.query.roomId); // 클라이언트에서 roomId가져오게 되었을 시 받아오기
    coupleHandleChatEvent(couple, socket);
  });

  return { meeting, couple };
}
