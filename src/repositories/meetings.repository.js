import { prisma } from '../utils/prisma/index.js';

//const { List, Card } = db;
export class MeetingsRepository {
  // 채팅방 생성
  createMeeting = async () => {

    const newMeeting = await prisma.meetings.create({
      data: {},
    });

    return newMeeting;
  };

  // 질문,지령,주제 생성 
  createQuestion = async (question) => {
    const createQuestion = await prisma.questions.create({
      data: {
        description: question
      }
    })

    return createQuestion;
  }

  // 채팅방 조회
  getAllMeetings = async () => {
    const allMeetings = await prisma.meetings.findMany();
    if (!allMeetings) {
      console.log("삭제 조건에 맞는 미팅방이 없습니다.");
      return;
    }
    return allMeetings;
  }

  // static async getListById(listId) {
  //   return db.List.findByPk(listId);
  // }


  // 채팅방 삭제 (채팅방 존재 유무 확인)
  findMeetingById = async (id) => {
    const meeting = await prisma.meetings.findUnique({
      where: {
        id: +id,
      },
      select: {
        id: true,
        type: true,
        createdAt: true,
      }
    });

    return meeting;
  };

  // 리스트 수정
  updateListName = async (listId, listName) => {
    const list = await prisma.meetings.update(
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
    const meeting = await prisma.meetings.delete({ where: { id: +id } })

    return meeting;
  }

  // 미팅방 자동 삭제
  autoDeleteMeeting = async (id) => {
    const meeting = await prisma.meetings.delete({ where: { id: +id } })

    if (!meeting) {
      console.log(`미팅방 ${id}가 이미 삭제되었거나 존재하지 않습니다.`);
      return;
    }
    return meeting;
  }


  // 타입에 맞는 채팅방들 찾기  meeting.chat.js
  existMeetingsAndUsers = async (type) => {

    return await prisma.meetings.findMany({
      where: {
        type: type,
      },
      select: {
        id: true,
        Members: {
          select: {
            userId: true,
          },
        },
      },
    });
  }







}
