import { MeetingsRepository } from "../repositories/meetings.repository.js"


export class MeetingsService {
  meetingsRepository = new MeetingsRepository();

  // 채팅방 생성
  createMeeting = async () => {
    const newMeeting = await this.meetingsRepository.createMeeting();
    return newMeeting;
  };

  // 리스트 조회
  getAllLists = async (boardId) => {
    const allLists = await this.meetingsRepository.getAllLists(boardId);

    return allLists;
  }

  // getListById = async (listId) => {
  //   return listsRepository.getListById(listId);
  // }

  // 리스트 수정
  updateListName = async (listId, listName) => {
    const list = await this.meetingsRepository.findListById(listId);

    if (!list) throw new Error('리스트가 존재하지 않습니다.');

    await this.meetingsRepository.updateListName(listId, listName);

    const updatedList = await this.meetingsRepository.findListById(listId);

    return {
      listId: updatedList.listId,
      listName: updatedList.listName,
    };
  }


  // 리스트 삭제
  deleteMeeting = async (id) => {
    const meeting = await this.meetingsRepository.findMeetingById(id);

    if (!meeting) throw new Error('미팅방이 존재하지 않습니다.');

    await this.meetingsRepository.deleteMeeting(id);

    return meeting;
  }

}