// chat.js에서 vote이벤트 만들고 보내고 
// socket에서 vote로 이벤트 받고 처리하고 다시 chat.js로 보내기

import { prisma } from '../utils/prisma/index.js';

export const handleVoteEvent = (io, socket) => {

    //socket.user = {name: socket.id};

    // 클라이언트에서 온 이벤트 접수
    socket.on('vote', async (data) => {
        try {
            const socketId = socket.id;
            const userId = 1; // 임시 (투표하는 유저) 유저 정보 받아 올 시 삭제
            const meetingId = 1; // 임시

            console.log("select data 확인 ", data);

            await prisma.votes.create({
                data: {
                    fromUser: { connect: { id: userId } },
                    toUser: { connect: { id: +data.option } },
                    meeting: { connect: { id: meetingId } },
                    isVote: true,
                }
            })

            // 내가 지목한 상대가 나를 지목 했을 경우 (서로 지목)
            // 해당 미팅방과 지목 받은 사람 나(현재 투표한 유저)를 기준으로 
            const votedMe = await prisma.votes.findFirst({
                where: {
                    meetingId: meetingId,
                    toUserId: userId
                },
                select: {
                    id: true,
                    toUserId: true,
                    fromUserId: true,
                }
            })

            //votedMe가 null값이 아닐경우 
            if (votedMe?.toUserId == userId) {
                
                io.emit('announce', { userId, votedMe });
            }

            // 서버에서 클라이언트로 발송
            io.emit('vote', { userId, option: data.option });

        } catch (err) {
            console.error("Error :", err);
        }
    })
}