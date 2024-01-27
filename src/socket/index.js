import { Server } from 'socket.io';
import http from 'http';
import { handleChatEvent } from './chat.js';
import { handleVoteEvent} from './vote.js';

export default function setupSocket(server) {

  // namespace 나눌 시 경로 설정
  const meeting = new Server(server, {path: "/meeting"});
  const couple = new Server(server, {path: "/couple"});


  meeting.on('connection', (socket) => {
    handleChatEvent(meeting, socket);
    handleVoteEvent(meeting, socket);
  });

  couple.on('connection', (socket)=> {
    handleChatEvent(couple, socket);
  });

  return {meeting, couple};
}
