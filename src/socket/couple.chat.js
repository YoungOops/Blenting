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
export const coupleHandleChatEvent = async (io, socket) => {
  try {

    // query 접근 시 handshake 사용 ex) socket.handshake.query.~~~
    console.log(socket.id); //socket.id
    //jwt 토큰
    const token = socket.handshake.query.authorization;

    const coupleId = socket.handshake.query.roomId;


    //jwt 가져옴,
    /**1)userId를 가져온다.
     * 2)userId로 user정보를 DB에서 가져온다.
     * 3)가져온 유저정보를 socket.user에 담는다.
     * 4)지금은 유저 name에 토큰 값 표시 -> user의 이메일로 변경을 해본다.
     * 아래 코드에는 name 이라는 키와 JWT 토큰 값의 밸류가 객체로 감싸져 있음.
     */
    const decoding = jwt.verify(token, process.env.JWT_SECRET);
    console.log("커플에서 디코딩 확인 ", decoding)
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
    const userId = checkUser.id;
    console.log("소켓 우저 확인", socket.user)
    // socket.user 객체에 사용자의 이메일을 저장합니다.
    // socket.user = { email: user.email };
    users.set(socket.id, socket.user.nickName); // 새 사용자의 입장을 모든 클라이언트에게 알립니다.  members 에 저장 (유저)

    // 현재 소개팅방과 유저(나) 찾기
    console.log('coupleId, userId 확인', coupleId, userId);
    const existingMember = await membersRepository.existingMember(coupleId, checkUser.id);
    console.log("커플에서 existingMember 확인1", existingMember);

    if (!existingMember) {
      // 중복되지 않은 경우에만 맴버에 추가
      await membersRepository.createMember(coupleId, checkUser.id);

    }
    let existingMembers = await membersRepository.getExistingMembers(coupleId);

    console.log("커플에서 existingMembers 확인2", existingMembers);

    let members = existingMembers.map(member => member.Users)

    //3번
    io.to(coupleId).emit('entry', {
      id: socket.decodedUserId,
      socketId: socket.id,
      me: socket.user.nickName,
      coupleId: coupleId,
      users: members       // Array.from(users.values()),
    }); // 들어오면 모두에게 입장을 알림 'entry', { 이게 데이터임 }
    console.log(`${socket.user.nickName} user connected couple`);
    // 사용자의 연결이 끊어졌을 때 처리합니다.
    socket.on('disconnect', async () => {
      // 해당 사용자의 ID를 users Set에서 제거합니다.
      // users.delete(socket.me);

      // 삭제를 위한 Members 아이디 가져오기
      const deleteMember = await membersRepository.existingMember(coupleId, userId);
      console.log('------------------------------------');
      console.log('커플방에서 삭제를 위한 members 아이디 가져오기', deleteMember);
      console.log('------------------------------------');

      // db에서 해당 인원 멤버에서 삭제
      await membersRepository.deleteMember(deleteMember.id);

      // 업데이트된 해당 방의 유저(닉네임)
      existingMembers = await membersRepository.getExistingMembers(coupleId);
      console.log("delete 후 existingMembers 확인", existingMembers)

      // 해당 방에 아무도 없으면 해당 방 삭제 // 2024 02 04 이게 필요할까?
      if (existingMembers.length === 0) {
        await meetingsRepository.deleteMeeting(coupleId);
        console.log('------------------------------------');
        console.log('아무도 없는 커플방 삭제');
        console.log('------------------------------------');
      }

      // 사용자의 퇴장을 모든 클라이언트에게 알립니다.
      io.to(coupleId).emit('exit', { id: socket.id, me: socket.user.nickName, users: existingMembers.map(member => member.Users) });
      console.log(`${socket.user.nickName} user disconnected couple`);
    });
    //io.emit 함수를 사용하여 서버에 연결된 모든 클라이언트에게 이벤트를 방송하고 있습니다.
    //특정 클라이언트에게만 메시지를 보내려면 socket.emit을 사용할 수 있습니다.
    /** 현재 서버와 모두가 연결이 되어있음, 챗 이벤트를 시작했을 때 어떠한 일을 할지 정의하는 코드 */
    //비동기 함수로 변경 // msg에 front의 input.value 가 담기게 된다.
    socket.on('couple chat message', async (msg) => {
      // 비동기 함수로 변경
      try {
        // 임시로 설정된 사용자 ID와 미팅 ID, 실제 환경에서는 인증 시스템을 통해 얻어야 함
        const userId = checkUser.id;
        const socketId = socket.id;
        const socketUser = socket.user.nickName;

        // MessagesRepository를 이용하여 메시지를 데이터베이스에 저장
        const newMessage = await messagesRepository.createMessage(
          userId,
          coupleId,
          msg,
        );
        // 메시지 저장 후 모든 클라이언트에게 메시지를 방송
        io.to(coupleId).emit('couple chat message', { socketId, socketUser, message: msg }); // 메시지 형식을 객체로 변경
        console.log("커플에서 socketId, socketUser 확인 ", socketId, socketUser)
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
    io.emit('couple auth_error', { message: 'Authentication failed' }); // 클라이언트에게 인증 실패를 알립니다.
    io.disconnect(); // 소켓 연결을 종료합니다.
  }
};