import { MeetingsRepository } from "../repositories/meetings.repository.js"


export class MeetingsService {
  meetingsRepository = new MeetingsRepository();

  // 채팅방 생성 
  createMeeting = async () => {
    const newMeeting = await this.meetingsRepository.createMeeting();
    return newMeeting;
  };

  // 채팅방 찾기
  findMeetingById = async (id) => {
    const meeting = await this.meetingsRepository.findMeetingById(id);

    return meeting;
  }

  // 질문,지령,주제 생성 (미완)
  createQuestion = async () => {
    const questionNum = this.makeRandomQuestionNum(1, 3);
    
    let question = "question";

    if (questionNum === 1) {
      question = "애인의 친구 꺳잎 떼어주기";
    } else if (questionNum === 2) {
      question = "애인의 친구 롱패딩 지퍼 올려주기";
    } else {
      question = "애인의 친구 새우 까주기";
    }

    const createQuestion = await this.meetingsRepository.createQuestion(question);

    return createQuestion;
  }

  makeRandomQuestionNum = (min, max) => {
    const questionNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return questionNum;
  }

  // 리스트 조회
  getAllLists = async (boardId) => {
    const allLists = await this.meetingsRepository.getAllLists(boardId);

    return allLists;
  }

  // getListById = async (listId) => {
  //   return listsRepository.getListById(listId);
  // }

  // 리스트 수정
  // updateListName = async (listId, listName) => {
  //   const list = await this.meetingsRepository.findListById(listId);

  //   if (!list) throw new Error('리스트가 존재하지 않습니다.');

  //   await this.meetingsRepository.updateListName(listId, listName);

  //   const updatedList = await this.meetingsRepository.findListById(listId);

  //   return {
  //     listId: updatedList.listId,
  //     listName: updatedList.listName,
  //   };
  // }


  // 리스트 삭제
  deleteMeeting = async (id) => {
    const meeting = await this.meetingsRepository.findMeetingById(id);

    if (!meeting) throw new Error('미팅방이 존재하지 않습니다.');

    await this.meetingsRepository.deleteMeeting(id);

    return meeting;
  }

}