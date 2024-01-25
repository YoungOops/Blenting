import { prisma } from '../utils/prisma/index.js';

//const { List, Card } = db;
export class MessagesRepository {
  // 메세지 생성
  createMessage = async (meeting_id, description) => {
    console.log('repository id 확인', meeting_id);
    const newMessage = await prisma.messages.create({
      data: {
        Users: { connect: { id: 1 } }, // 유저 1과 연결 (인증미들웨어가 있을 시 수정)
        Meetings: { connect: { id: +meeting_id } },
        //meeting_id: +meeting_id, meeting_id를 메세지 생성 시 직접 값을 넣어주려 했으나 prisma는 스키마에서 관계를 설정해서 값을 넣어줌 (더 찾아보기)
        description: description,
      },
    });

    return newMessage;
  };

  // 메세지 조회
  getAllMessages = async (meeting_id) => {
    const allMessages = await prisma.messages.findMany({
      where: {
        meetingId: +meeting_id,
      },
    });
    return allMessages;
  };

  //  채팅방 존재 유무 확인 (채팅방 삭제)
  findMeetingById = async (meeting_id) => {
    const meeting = await prisma.meetings.findUnique({
      where: {
        id: +meeting_id,
      },
      select: {
        id: true,
      },
    });

    return meeting;
  };

  //  메세지 존재 유무 확인 (메세지 삭제)
  findMessageById = async (id) => {
    const message = await prisma.messages.findUnique({
      where: {
        id: +id,
      },
      select: {
        id: true,
      },
    });
    return message;
  };

  // 리스트 수정
  updateListName = async (listId, listName) => {
    const list = await prisma.messages.update(
      {
        listName,
      },
      {
        where: {
          listId: +listId,
        },
      },
    );

    return list;
  };

  // 리스트 삭제
  deleteMessage = async (id) => {
    console.log('레포지 아이디 확인', id);
    const message = await prisma.messages.delete({ where: { id: +id } });
    console.log('repository 메세지 삭제 확인', message);
    return message;
  };
}
