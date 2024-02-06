// chat.js에서 vote이벤트 만들고 보내고 
// socket에서 vote로 이벤트 받고 처리하고 다시 chat.js로 보내기
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { prisma } from '../utils/prisma/index.js';
import { MeetingsService } from '../services/meetings.service.js';
dotenv.config();

const meetingsService = new MeetingsService();

export const handleVoteEvent = async (io, socket) => {

    //socket.user = {name: socket.id};

    const meetingId = socket.handshake.query.roomId;

    //jwt 토큰
    const token = socket.handshake.query.authorization;

    const decoding = jwt.verify(token, process.env.JWT_SECRET);
    console.log("vote디코딩 확인 ", decoding)
    const decodedUserId = decoding.userId;
    const checkUser = await prisma.users.findUnique({
        //users 테이블에서 하나를 찾는 프리즈마 메서드 findUnique
        //where은 조건 : { id는 users 테이블의 id : user 는 위에 jwt디코드한거.userId }
        //id : decodedUserId 는 서로 같다는 의미 => 데이터가 있으면 인증이 되는 것이다.
        where: { id: decodedUserId },
    });
    // 근데 데이터가 있는지 없는지 확인.
    if (!checkUser) {
        // 유저 데이터 없으면 에러를 날린다.
        throw new Error('User not found');
    }

    const roomId = socket.handshake.query.roomId;

    // 클라이언트에서 온 이벤트 접수
    socket.on('vote', async (data) => {
        try {
            const socketId = socket.id;
            const userId = checkUser.id; // (투표하는 유저) 유저 정보 받아 올 시 삭제

            console.log('------------------------------------');
            console.log('select data 확인 ', data);
            console.log('------------------------------------');

            const newVote = await prisma.votes.create({
                data: {
                    fromUser: { connect: { id: userId } },
                    toUser: { connect: { id: +data.option } },
                    meeting: { connect: { id: +roomId } },
                    isVote: true,
                }
            })




            // 내가 지목한 상대가 나를 지목 했을 경우 (서로 지목)
            // 해당 미팅방과 지목 받은 사람 나(현재 투표한 유저)를 기준으로 
            const votedMe = await prisma.votes.findFirst({
                where: {
                    meetingId: +roomId,
                    toUserId: +userId
                },
                select: {
                    id: true,
                    toUserId: true,
                    fromUserId: true,
                }
            })


            const fromUser = await prisma.users.findUnique({
                where: { id: userId },
                select: { id: true, nickName: true }
            })

            const toUser = await prisma.users.findUnique({
                where: { id: +data.option },
                select: { id: true, nickName: true }
            })


            console.log(`fromUserId 확인 : ${fromUser.nickName}, toUserId 확인 : ${toUser.nickName}`)

            const fromUserNickName = fromUser.nickName;
            const toUserNickName = toUser.nickName;
            //votedMe가 null값이 아닐경우 
            if (votedMe?.toUserId == userId) {

                io.to(meetingId).emit('announce', { fromUser, toUser });

            }

            // 서버에서 클라이언트로 발송
            io.to(meetingId).emit('vote', { fromUserNickName, toUserNickName });

        } catch (err) {
            console.error("Error :", err);
        }
    })

    // socket.on('create couple', async (data) => {
    //     try {
    //         const couple = await meetingsService.findAndGetMeeting('COUPLE');

    //         //socket.join(couple.id);
    //         await io.to(meetingId).emit('move couple', { couple });
    //         console.log('------------------------------------');
    //         console.log('소개팅 방 생성', couple.id)
    //         console.log('------------------------------------');
            
    //     } catch (err) {
    //         console.error('소개팅 방 생성 에러', err);
    //     }
    // })

}