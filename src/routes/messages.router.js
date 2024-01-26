import { Router } from 'express';
import { MessagesController } from '../controllers/messages.controller.js';
import { isAuth } from '../middlewares/auth.middleware.js';


const messagesController = new MessagesController();

const messagesRouter = Router();

// 메세지 생성
messagesRouter.post('/:meeting_id', isAuth, messagesController.createMessage);


// 조회
messagesRouter.get('/:meeting_id', messagesController.getAllMessages);



//삭제
messagesRouter.delete('/:meeting_id/:id', messagesController.deleteMessage);


export { messagesRouter };