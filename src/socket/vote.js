// chat.js에서 vote이벤트 만들고 보내고 
// socket에서 vote로 이벤트 받고 처리하고 다시 chat.js로 보내기
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { prisma } from '../utils/prisma/index.js';
import { MeetingsService } from '../services/meetings.service.js';
dotenv.config();

const meetingsService = new MeetingsService();

// 투표 한 인원 저장
let voteUsers = new Map();

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

            // map에서 해당 meetingId에 대한 값을 가져옴
            let voteUsersInRoom = voteUsers.get(meetingId);

            // 만약 해당 meetingId에 대한 값이 없다면 새로운 배열을 생성 (동시에 들어올 경우)
            if (!voteUsersInRoom) {
                voteUsersInRoom = [];
            } else {
                // 이전에 지목 한 내 voteSocketId 제거
                voteUsersInRoom = voteUsersInRoom.filter(user => user.voteSocketId !== socketId)
            }

            // 투표한 인원 소켓아이디 저장
            voteUsersInRoom.push({ voteSocketId: data.voteUserSocketId, toUserId: data.option });

            // 수정된 값 다시 맵에 저장
            voteUsers.set(meetingId, voteUsersInRoom);
            console.log('------------------------------------');
            console.log('select data 확인 ', data);
            console.log('voteUsersInRoom 확인', voteUsersInRoom);
            console.log('------------------------------------');


            // 이전에 내가 지목했던 이력 찾기
            const voteLog = await prisma.votes.findFirst({
                where: {
                    fromUserId: +userId,
                    isVote: true,
                },
                select: {
                    id: true,
                }
            })

            if(voteLog){

                
            // 찾은 나의 지목 이력 삭제 (이력이 계속 남아있으면 나를 지목한 유저를 찾을 때의 로직에 걸림)
            const deleteVoteLog = await prisma.votes.delete({
                where: {
                    id: voteLog.id,
                }
            })

            }



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
                select: { id: true, nickName: true, gender: true }
            })

            const toUser = await prisma.users.findUnique({
                where: { id: +data.option },
                select: { id: true, nickName: true, gender: true }
            })


            console.log(`fromUserId 확인 : ${fromUser.nickName}, toUserId 확인 : ${toUser.nickName}`)

            const fromUserNickName = fromUser.nickName;
            const toUserNickName = toUser.nickName;

            //votedMe가 null값이 아닐경우 
            if (votedMe?.fromUserId == toUser.id) {

                // announce에 보내기 위해 map에서 지목 한 인윈 추출
                // voteUsersInRoom안에 유저 중 meetingId에 속한 유저들 추출
                const usersInRoom = voteUsers.get(meetingId);

                // usersInRoom유저들 중 지목 한 유저아이디와 같은 유저의 소켓아이디 추출
                const userSocketId = usersInRoom.find(user => user.toUserId === fromUser.id)?.voteSocketId;
                // usersInRoom유저들 중 지목 당한 유저아이디와 같은 유저의 소켓아이디 추출
                const anotherUserSocketId = usersInRoom.find(user => user.toUserId === toUser.id)?.voteSocketId;

                console.log('------------------------------------');
                console.log('userSocketId, anotherUserSocketId 확인', userSocketId, anotherUserSocketId);
                console.log('------------------------------------');

                io.to(meetingId).emit('announce', { fromUser, toUser, userSocketId, anotherUserSocketId });

                // 해당 meetingId에서 지목한 유저들 삭제
                voteUsers.set(meetingId, usersInRoom.filter(user => user.toUserId !== fromUser.id && user.toUserId !== toUser.id));
                console.log("voteUsersInRoom 확인 ", voteUsers.get(meetingId));
            }

            // 서버에서 클라이언트로 발송
            io.to(meetingId).emit('vote', { fromUserNickName, toUserNickName });

        } catch (err) {
            console.error("Error :", err);
        }
    })

    socket.on('join couple', (data) => {
        try {

            console.log('------------------------------------');
            console.log("join couple data 확인", data);
            console.log('------------------------------------');
            //socket.join(couple.id);
            // io.to(meetingId).emit('move couple', { couple });
            // console.log('------------------------------------');
            // console.log('소개팅 방 생성', couple.id)
            // console.log('------------------------------------');

        } catch (err) {
            console.error(err);
        }
    })

}