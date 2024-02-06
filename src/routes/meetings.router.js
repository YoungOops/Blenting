import { Router } from 'express';
import { MeetingsController } from '../controllers/meetings.controller.js';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';

const meetingsController = new MeetingsController();
const authMiddleware = new AuthMiddleware();

const meetingsRouter = Router();

//생성
meetingsRouter.post('/', meetingsController.createMeeting);


// 남아있는 미팅방 조회
meetingsRouter.get('/', authMiddleware.isAuth, meetingsController.findAndGetMeeting);



//삭제 (생성 후 30분 후 삭제)
meetingsRouter.delete('/:id', meetingsController.deleteMeeting);


export { meetingsRouter };