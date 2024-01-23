import { MeetingsRepository } from "../repositories/meetings.repository.js"
import cron from 'node-cron';

export class MeetingsService {
  meetingsRepository = new MeetingsRepository();

  constructor() {
    /*this.meetingCleanupJob =*/ cron.schedule('* * * * * *',() => {
      this.autoDeleteMeetings();
    })
  }

  autoDeleteMeetings = async () => {
    console.log("스케줄 실행 ----------------");
    const meetings = await this.meetingsRepository.getAllMeetings();
    
    for (const meeting of meetings) {
      const currentTime = new Date();
      const createdAt = new Date(meeting.createdAt);

      if (currentTime - createdAt >= 5000) {
        await this.meetingsRepository.autoDeleteMeeting(meeting.id, createdAt);
        console.log(`${meeting.id}번 미팅방 삭제`);
      }
    }
  }

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

  // create에서 동작하는게 아니라 따로 (서버가 시작되면 바로 실행 될 수 있게) 30분 지난 미팅방
  // autoDeleteMeetingV2 = async () => {
    
  //     this.meetingCleanupJob;
      
  // }


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
    // 미팅방 존재 확인
    const meeting = await this.meetingsRepository.findMeetingById(id);

    if (meeting) {
      const deletedMeeting = await this.meetingsRepository.deleteMeeting(id);
      return deletedMeeting;
    } else {
      throw new Error('미팅방이 존재하지 않습니다.');
    }


    //return meeting;
  }



  // autoDeleteMeetings = async (createdAt) => {
  //   const currentTime = new Date();


  //     if (currentTime - createdAt >= 5000) {
  //       const deletedMeeting = await this.meetingsRepository.autoDeleteMeeting(id);
  //       return deletedMeeting; 
  //   } else {
  //     throw new Error('미팅방이 존재하지 않습니다.');
  //   }


  // }

}