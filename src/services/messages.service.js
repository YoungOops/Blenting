import { MessagesRepository } from "../repositories/messages.repository.js";


export class MessagesService {
  messagesRepository = new MessagesRepository();

  // 메세지 생성
  createMessage = async (meeting_id, description) => {
    const newMessage = await this.messagesRepository.createMessage(meeting_id, description);
    return newMessage;
  };

  // 리스트 조회
  getAllLists = async (boardId) => {
    const allLists = await this.messagesRepository.getAllLists(boardId);

    return allLists;
  }

  // getListById = async (listId) => {
  //   return listsRepository.getListById(listId);
  // }

  // 리스트 수정
  updateListName = async (listId, listName) => {
    const list = await this.messagesRepository.findListById(listId);

    if (!list) throw new Error('리스트가 존재하지 않습니다.');

    await this.messagesRepository.updateListName(listId, listName);

    const updatedList = await this.messagesRepository.findListById(listId);

    return {
      listId: updatedList.listId,
      listName: updatedList.listName,
    };
  }


  // 리스트 삭제
  deleteMeeting = async (id) => {
    const meeting = await this.messagesRepository.findMeetingById(id);

    if (!meeting) throw new Error('리스트가 존재하지 않습니다.');

    await this.messagesRepository.deleteMeeting(id);

    return meeting;
  }

}