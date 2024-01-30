import { MessagesRepository } from '../repositories/messages.repository.js';
import { MeetingsRepository } from '../repositories/meetings.repository.js';
import { MembersRepository } from '../repositories/members.repository.js';
import { prisma } from '../utils/prisma/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const messagesRepository = new MessagesRepository();
const meetingsRepository = new MeetingsRepository();
const membersRepository = new MembersRepository();
//2번
let users = new Map();
// 메모리에 유저정보 저장하는건데 -> DB에 저장하는 방식으로 바꾸기
// js : Map, Set 찾아보기



export const meetingHandleChatEvent = async (io, socket) => {
  try {
    // 2024 01 29 따로 빼서 수정하기 ex) 미팅방의 정원설정, 이후 정원이 차게 되면 새로운 방 만들기 등

    // 채팅방 타입
    const type = 'GROUP';
    // 채팅방 정원
    const maxMeetingCapacity = 6;

    // 그룹 타입의 채팅방의 id, members의 userId
     // existMeetingsAndUsers(async 함수)에 return이 없으면 promise 객체 자체를 반환하기때문에 if문에서 항상 true 반환
    const meetingAndUser = await meetingsRepository.existMeetingsAndUsers(type);

    console.log('meeting방 인원 확인',meetingAndUser);

    // 정원이 안 찬 미팅방
    let meeting;

    // every => 배열의 모든 요소가 주어진 조건을 만족하면 true   채팅방의 현 인원수가 정원보다 이상이면
    if (!meetingAndUser || meetingAndUser.every(meeting => meeting.Members.length >= maxMeetingCapacity)) {

      await meetingsRepository.createMeeting();
      
    } else {
      // find 조건을 만족하는 첫 번째를 반환
      meeting = meetingAndUser.find(user => user.Members.length < maxMeetingCapacity);

    }




    // query 접근 시 handshake 사용 ex) socket.handshake.query.~~~
    console.log(socket.id); //socket.id
    //jwt 토큰
    console.log('!@@@@@@@@@@@@@', socket.handshake.query.authorization);
    const token = socket.handshake.query.authorization;
    console.log("토큰 확인", token)


    //jwt 가져옴,
    /**1)userId를 가져온다.
     * 2)userId로 user정보를 DB에서 가져온다.
     * 3)가져온 유저정보를 socket.user에 담는다.
     * 4)지금은 유저 name에 토큰 값 표시 -> user의 이메일로 변경을 해본다.
     * 아래 코드에는 name 이라는 키와 JWT 토큰 값의 밸류가 객체로 감싸져 있음.
     */
    const decoding = jwt.verify(token, process.env.JWT_SECRET);
    console.log("디코딩 확인 ", decoding)
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
    socket.user = { nickName: checkUser.nickName }; // => checkUser
    console.log("소켓 우저 확인", socket.user)
    // socket.user 객체에 사용자의 이메일을 저장합니다.
    // socket.user = { email: user.email };
    users.set(socket.id, socket.user.nickName); // 새 사용자의 입장을 모든 클라이언트에게 알립니다.  members 에 저장 (유저)

    // 현재 미팅방과 유저(나) 찾기 
    const existingMember = await membersRepository.existingMember(meeting.id, checkUser.id);

    if (!existingMember) {
      // 중복되지 않은 경우에만 맴버에 추가
      await membersRepository.createMember(meeting.id, checkUser.id);

    }



    //3번
    io.emit('meeting entry', {
      id: socket.decodedUserId,
      me: socket.user.nickName,
      users: Array.from(users.values()),
    }); // 들어오면 모두에게 입장을 알림 'entry', { 이게 데이터임 }
    console.log(`${socket.user.nickName} user connected meeting`);
    // 사용자의 연결이 끊어졌을 때 처리합니다.
    socket.on('disconnect', () => {
      // 해당 사용자의 ID를 users Set에서 제거합니다.
      users.delete(socket.me);
      // 사용자의 퇴장을 모든 클라이언트에게 알립니다.
      io.emit('meeting exit', { id: socket.id, me: socket.user.nickName, users: Array.from(users.values()) });
      console.log(`${socket.user.nickName} user disconnected meeting`);
    });
    //io.emit 함수를 사용하여 서버에 연결된 모든 클라이언트에게 이벤트를 방송하고 있습니다.
    //특정 클라이언트에게만 메시지를 보내려면 socket.emit을 사용할 수 있습니다.
    /** 현재 서버와 모두가 연결이 되어있음, 챗 이벤트를 시작했을 때 어떠한 일을 할지 정의하는 코드 */
    //비동기 함수로 변경 // msg에 front의 input.value 가 담기게 된다.
    socket.on('meeting chat message', async (msg) => {
      // 비동기 함수로 변경
      console.log('클라이언트에서 받은 메세지 이벤트')
      try {
        // 임시로 설정된 사용자 ID와 미팅 ID, 실제 환경에서는 인증 시스템을 통해 얻어야 함
        const userId = checkUser.id;
        const meetingId = meeting.id;
        const socketId = socket.id;
        const socketUser = socket.user.nickName;
        // MessagesRepository를 이용하여 메시지를 데이터베이스에 저장
        const newMessage = await messagesRepository.createMessage(
          userId,
          meetingId,
          msg,
        );
        // 메시지 저장 후 모든 클라이언트에게 메시지를 방송
        io.emit('meeting chat message', { socketId, socketUser, message: msg }); // 메시지 형식을 객체로 변경
        console.log("socketId, socketUser 확인 ", socketId, socketUser)
        console.log("메세지 db에 저장 후 다시 클라이언트로 전송")
        console.log('message: ', msg);
        // io.emit('chat message', socket.id + ' ' + msg); // 한 클라이언트가 말하면 모두에게 msg를 알림
      } catch (error) {
        // 에러 처리 로직
        console.error('Error saving message:', error);
        // 필요한 경우 에러를 클라이언트에게 전송
      }
    });
  } catch (error) {
    // 에러 핸들링: 인증 실패 또는 데이터베이스 조회 실패 시
    console.error('Authentication error:', error);
    io.emit('meeting auth_error', { message: 'Authentication failed' }); // 클라이언트에게 인증 실패를 알립니다.
    io.disconnect(); // 소켓 연결을 종료합니다.
  }
};