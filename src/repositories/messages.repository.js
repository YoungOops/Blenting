import { prisma } from '../utils/prisma/index.js';

//const { List, Card } = db;
export class MessagesRepository {
  // 메세지 생성
  createMessage = async (meeting_id, description) => {

    const newMessage = await prisma.messages.create({
      data: {
        users: { connect: { id: 3 } }, // 유저 3과 연결 (인증미들웨어가 있을 시 수정)
        meetings: {connect: {id: +meeting_id}},
        meeting_id: +id,
        description,
      },
    });

    return newMessage;
  };

  // 리스트 조회
  getAllLists = async (boardId) => {
    const allLists = await prisma.messages.findAll({
      attributes: ['listName'],
      order: [['listOrder']], // listOrder로 
      include: [{ model: Card, as: 'cards', attributes: ['title'], }],
      where: {
        boardId
      },
    });
    return allLists;
  }

  // static async getListById(listId) {
  //   return db.List.findByPk(listId);
  // }


  //  채팅방 존재 유무 확인 (채팅방 삭제)
  findMeetingById = async (meeting_id) => {
    const meeting = await prisma.meetings.findUnique({
      where: {
        id: +meeting_id,
      },
      select: {
        id: true,
      }
    });

    return meeting;
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
        }
      },
    );

    return list;
  }

  // 리스트 이동
  moveList = async (boardId, listId, listOrder) => {

    // // 현재 보드의 리스트 findAll
    // const allLists = await db.List.findAll({
    //   where: { boardId }
    // });

    // // 리스트 이동 실행 조건 (map)
    // // 리스트가 2개 이상일떄
    // if (allLists.length >= 2) {

    //   //1. 맨 엎으로 이동 할 경우 가장 작은 listOrder의 값에 2로 나누어 수정
    //   // 가장 작은 리스트의 listOrder 찾기
    //   const minListOrder = Math.min(...allLists.map(list => list.listOrder));

    //   listOrder = minListOrder / 2;

    //   const moveListForefront = await db.List.update(
    //     {
    //       listOrder,
    //     },
    //     {
    //       where: {
    //         listId: +listId,
    //       }
    //     }
    //   )

    //   return moveListForefront;
    // }


    const moveList = await db.List.update(
      {
        listOrder,
      },
      {
        where: {
          listId: +listId,
        }
      }
    )

    return moveList;

  };

  // 리스트 삭제
  deleteMeeting = async (id) => {
    const meeting = await prisma.messages.delete({ where: { id: +id } })

    return meeting;
  }
}
