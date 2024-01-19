import { Router } from 'express';
import { MessagesController } from '../controllers/messages.controller.js';


const messagesController = new MessagesController();

const messagesRouter = Router();

// 메세지 생성
messagesRouter.post('/:meeting_id', messagesController.createMessage);


// 조회
messagesRouter.get('/:meeting_id', messagesController.getAllMessages);



//삭제
messagesRouter.delete('/:meeting_id/:id', messagesController.deleteMessage);


export { messagesRouter };