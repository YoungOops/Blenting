import { MessagesRepository } from "../repositories/messages.repository.js";


export class MessagesService {
  messagesRepository = new MessagesRepository();

  // 메세지 생성
  createMessage = async (meeting_id, description) => {
    console.log("service id 확인", meeting_id)
    const newMessage = await this.messagesRepository.createMessage(meeting_id, description);
    return newMessage;
  };

  // 메세지 조회
  getAllMessages = async (meeting_id) => {
    const allMessages = await this.messagesRepository.getAllMessages(meeting_id);

    return allMessages;
  }

  // getListById = async (listId) => {
  //   return listsRepository.getListById(listId);
  // }

  // // 리스트 수정
  // updateListName = async (listId, listName) => {
  //   const list = await this.messagesRepository.findListById(listId);

  //   if (!list) throw new Error('리스트가 존재하지 않습니다.');

  //   await this.messagesRepository.updateListName(listId, listName);

  //   const updatedList = await this.messagesRepository.findListById(listId);

  //   return {
  //     listId: updatedList.listId,
  //     listName: updatedList.listName,
  //   };
  // }


  // 메세지 삭제
  deleteMessage = async (id) => {
    console.log("서비스아이디 확인", id);
    const message = await this.messagesRepository.findMessageById(id);
    console.log("서비스 메세지 삭제 아이디 확인", message)
    if (!message) throw new Error('메세지가 존재하지 않습니다.');

    const deletedMessage = await this.messagesRepository.deleteMessage(id);

    return deletedMessage;
  }

}