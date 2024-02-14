import { MeetingsRepository } from "../repositories/meetings.repository.js";
import { MembersRepository } from "../repositories/members.repository.js";
//import cron from 'node-cron';

export class MeetingsService {
  meetingsRepository = new MeetingsRepository();
  membersRepository = new MembersRepository();
  constructor() {
    // /*this.meetingCleanupJob =*/ cron.schedule('*/5 * * * * *',() => {
    //   this.autoDeleteMeetings();
    // })
  }

  // autoDeleteMeetings = async () => {                                 cron 자동삭제
  //   console.log("스케줄 실행 ----------------");
  //   const meetings = await this.meetingsRepository.getAllMeetings();

  //   for (const meeting of meetings) {
  //     const currentTime = new Date();
  //     const createdAt = new Date(meeting.createdAt);

  //     if (currentTime - createdAt >= 5000) {
  //       await this.meetingsRepository.autoDeleteMeeting(meeting.id, createdAt);
  //       console.log(`${meeting.id}번 미팅방 삭제`);
  //     }
  //   }
  // }

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

  // 그룹타입의 미팅방 찾기
  findAndGetMeeting = async (type, userId) => {

    const userInfo = await this.membersRepository.findUserInfo(userId);

    const userGender = userInfo.gender;

    // 미팅방의 정원설정, 이후 정원이 차게 되면 새로운 방 만들기 등

    //const maxMeetingCapacity = 6;



    // 타입에 따른 채팅방 정원
    let maxMeetingCapacity = 0;

    // type을 가져올 시
    if (type === 'GROUP') {
      maxMeetingCapacity = 4; // 테스트를 위한 2 설정 maxMeetingCapacity = 6

    } else if (type === 'COUPLE') {
      maxMeetingCapacity = 2;
    }

    const maxGender = maxMeetingCapacity / 2;


    // 타입의 채팅방의 id, members의 userId
    // existMeetingsAndUsers(async 함수)에 return이 없으면 promise객체 자체를 반환하기때문에 if문에서 항상 true 반환
    const meetingAndUser = await this.meetingsRepository.existMeetingsAndUsers(type);

    console.log('------------------------------------');
    console.log('meeting방 인원 확인', meetingAndUser);
    console.log('------------------------------------');

    // 정원이 안 찬 미팅방
    let meeting;

    const meetingsIsFull = meetingAndUser.every(meeting => meeting.Members.length >= maxMeetingCapacity)

    // every => 배열의 모든 요소가 주어진 조건을 만족하면 true   채팅방의 현 인원수가 정원보다 이상이면
    if (!meetingAndUser || meetingsIsFull) {

      console.log('------------------------------------');
      console.log("공석이 없으므로 방 생성");
      console.log('------------------------------------');
      meeting = await this.meetingsRepository.createMeeting(type);
      return { meeting, userGender };

    } else {
      console.log('------------------------------------');
      console.log('공석이 있으므로 방 지정 start');
      console.log('------------------------------------');
      // find 조건을 만족하는 첫 번째를 반환
      meeting = meetingAndUser.find(user => {
        const maleCount = user.Members.filter(member => member.Users.gender === 'MALE').length;
        console.log('maleCount 확인 ', maleCount)

        const femaleCount = user.Members.filter(member => member.Users.gender === 'FEMALE').length;
        console.log('femaleCount 확인 ', femaleCount)

        const isMaleFull = (userGender === 'MALE' && maleCount === maxGender);
        const isFemaleFull = (userGender === 'FEMALE' && femaleCount === maxGender);
        return (!isMaleFull && !isFemaleFull);
      });


      console.log("정원과 각 성별의 인원을 확인한 방 확인 ", meeting)


      if (meeting) {
        console.log('성별 조건을 거친 후 방 지정 방 번호', meeting.id, '유저 아이디 ', userId)
        return { meeting, userGender };
      } else {
        console.log('성별 조건을 거친 후 방 생성')
        const newMeeting = await this.meetingsRepository.createMeeting(type);

        return { newMeeting, userGender };
      }


    }

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