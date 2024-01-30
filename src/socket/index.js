import { Server } from 'socket.io';
import http from 'http';
import { meetingHandleChatEvent } from './meeting.chat.js';
import { coupleHandleChatEvent } from './couple.chat.js';
import { handleVoteEvent } from './vote.js';

export default function setupSocket(server) {

  const io = new Server(server);
  const meeting = io.of('/meeting');
  const couple = io.of('/couple');
  // namespace 나눌 시 경로 설정
  // const meeting = new Server(server, { path: '/meeting' });
  // const couple = new Server(server, { path: '/couple' });


  meeting.on('connection', (socket) => {
    console.log('Meeting Room Connection:', socket.rooms);
    console.log('Meeting Socket Query:', socket.handshake.query);


    socket.join('meetingRoom');
    // 2024 01 29 socket.join(socket.handshake.query.roomId); 클라이언트에서 roomId가져오게 되었을 시 받아오기
    meetingHandleChatEvent(meeting, socket);
    handleVoteEvent(meeting, socket);
  });

  couple.on('connection', (socket) => {
    console.log('Couple Room Connection:', socket.rooms);
    console.log('Couple Socket Query:', socket.handshake.query);


    socket.join('coupleRoom');
    //2024 01 29 socket.join(socket.handshake.query.roomId); 클라이언트에서 roomId가져오게 되었을 시 받아오기
    coupleHandleChatEvent(couple, socket);
  });

  return { meeting, couple };
}
