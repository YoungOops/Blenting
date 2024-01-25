import { Server } from 'socket.io';
import { handleChatEvent } from './chat.js';
import { handleVoteEvent} from './vote.js';

export default function setupSocket(server) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    handleChatEvent(io, socket);
    handleVoteEvent(io, socket);
  });
  return io;
}
